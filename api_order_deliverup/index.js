const notif = require("./notif.js");
const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const PORT = process.env.PORT;
const API = process.env.API;

const axios = require("axios").default;
const clientsList = [];
const merchantsOpen = [];

io.on("connection", async (socket) => {
  /* ========== CLIENT DASHBOARD ORDERS ========== */

  // When connected, client is saved in clientList array as a new Object
  socket.on("storeClientInfo", function (data) {
    const index = clientsList.findIndex(
      (clientInfo) => clientInfo.customId === data.idClient
    );
    if (index === -1) {
      const client = {
        clientId: data.idClient,
        socketIds: [socket.id],
      };
      clientsList.push(client);
    } else {
      clientList[index].socketIds.push(socket.id);
    }
  });

  // GET all client orders
  socket.on("getClientOrders", (value) => {
    const idUser = value.idClient;
    const token = value.token;
    console.log(value);
    axios
      .get(`${API}/api/user/getOrder/${idUser}/${token}`)
      .then((response) => {
        io.emit(idUser + "-sendClientOrders", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // GET all deliverer orders
  socket.on("getDelivererOrders", (value) => {
    const idUser = value.idDeliverer;
    const token = value.token;
    axios
      .get(`${API}/api/user/getOrder/deliverer/${idUser}/${token}`)
      .then((response) => {
        io.emit(idUser + "-sendDelivererOrders", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // Reset order to step 1
  socket.on("resetOrder", async (value) => {
    const idUser = value.order.user.idUser;
    const token = value.token;
    const idOrder = value.order._id;
    const state = "pendingMerchant";
    clientPatchAndGet(idUser, token, idOrder, state);
  });

  // Merchant accepted order, then looking for deliverer
  socket.on("pendingMerchant", async (value) => {
    const idUser = value.order.user.idUser;
    const token = value.token;
    const idOrder = value.order._id;
    const state = "pendingDeliverer";
    await clientPatchAndGet(idUser, token, idOrder, state);
  });

  // Deliverer accepted order, then order goes on delivery
  socket.on("awaitingDelivery", async (value) => {
    const idUser = value.order.user.idUser;
    const token = value.token;
    const idOrder = value.order._id;
    const state = "awaitingDelivery";
    clientPatchAndGet(idUser, token, idOrder, state);
  });

  // Delivery is done
  socket.on("doneDelivery", async (value) => {
    const idUser = value.order.user.idUser;
    const token = value.token;
    const idOrder = value.order._id;
    const state = "done";
    clientPatchAndGet(idUser, token, idOrder, state);
  });

  // Method to patch client order state & get new order datas
  clientPatchAndGet = async (idUser, token, idOrder, state) => {
    const sendPatch = `${API}/api/user/order/state/${idOrder}/${idUser}/${token}`;
    const sendGet = `${API}/api/user/getOrder/${idUser}/${token}`;
    const requestOne = await axios.patch(sendPatch, { state: state });
    const requestTwo = await axios.get(sendGet);
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          if (responses[1].data) {
            socket.emit(
              idUser + "-sendClientOrders",
              JSON.stringify(responses[1].data)
            );
          }
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  };

  /* ========== MERCHANT DASHBOARD ORDERS ========== */

  socket.on("merchantIsOpen", async (data) => {
    const index = merchantsOpen.findIndex(
      (element) => element.merchantId === data.merchantId
    );
    if (index === -1) {
      const merchant = {
        socketIds: [socket.id],
        merchantId: data.merchantId,
      };
      merchantsOpen.push(merchant);
    } else {
      const index1 = merchantsOpen[index].socketIds.findIndex(
        (socketId) => socketId === socket.id
      );
      if (index1 === -1) {
        merchantsOpen[index].socketIds.push(socket.id);
      }
    }
    // console.log(socket.id)
    console.log(merchantsOpen);
    console.log(`from ${socket.id}`);
  });

  socket.on("merchantIsClosed", async (data) => {
    const index = merchantsOpen.findIndex(
      (element) => element.merchantId === data.merchantId
    );
    const socketIds = merchantsOpen[index].socketIds;
    for (let socketId in socketIds) {
      io.to(socketIds[socketId]).emit("closing");
    }
    merchantsOpen.splice(index, 1);
    console.log(merchantsOpen);
    console.log(`from ${socket.id}`);
  });

  socket.on("setNewOrder", async (data) => {
    console.log(data, "data recieved from client in event setNewOrder");
    const { token, ...rest } = data;

    // First we have to verify if client id exists
    const indexClient = clientsList.findIndex(
      (client) => client.clientId === data.user.idUser
    );
    if (indexClient === -1) {
      // stock client ids
      const client = {
        socketIds: [socket.id],
        clientId: data.user.idUser,
      };
      clientsList.push(client);
    } else {
      const indexSocketClient = clientsList[indexClient].socketIds.findIndex(
        (socketId) => socketId === socket.id
      );
      if (indexSocketClient === -1) {
        clientsList[indexClient].socketIds.push(socket.id);
      }
    }

    let order;
    await axios
      .post(`${API}/api/order/new/${data.user.idUser}/${data.token}`, rest)
      .then((res) => {
        if (res.data.user) {
          console.log("Successfully new order posted ! ");
          order = res.data;
        } else {
          console.log(res.data);
        }
      })
      .catch((err) => console.error(`Cannot post new order : ${err}`));

    const indexMer = merchantsOpen.findIndex(
      (element) => element.merchantId === data.merchant.idMerchant
    );
    if (indexMer !== -1) {
      const socketIds = merchantsOpen[indexMer].socketIds;
      for (let socketId in socketIds) {
        io.to(socketIds[socketId]).emit("getNewOrder", order);
      }
      notif.sendNotificationToMerchant(order);
      console.log("Order successfully sent to merchant !");
    } else {
      console.error(`Merchant with id ${data.merchant.idMerchant} not found`);
    }
    socket.emit("newOrderPosted");
  });

  socket.on("acceptedOrder", async (data) => {
    // then we patch order state
    let order;
    await axios
      .patch(
        `${API}/api/order/update/${data._id}/${data.merchant.idMerchant}/${data.token}`,
        { state: "pendingDeliverer" }
      )
      .then((res) => {
        // console.log(res.data);
        order = res.data;
        console.log("Merchant accept successfully updated");
      })
      .catch((err) =>
        console.error(`Error at updating order ${data._id} : ${err}`)
      );

    // here we have to send to client that the merchant accepted his order
    const indexClient = clientsList.findIndex(
      (client) => client.clientId === data.user.idUser
    );
    if (indexClient !== -1) {
      const socketIds = clientsList[indexClient].socketIds;
      for (let socketId in socketIds) {
        io.to(socketIds[socketId]).emit("orderUpdated", order);
      }
      notif.sendNotificationToClientForOrder(order);
      console.log("Update order successfully sent to client");
    } else {
      socket.emit("error", "user not found");
    }
  });

  socket.on("delivererTakesOrder", async (data) => {
    // a deliverer takes in charge the order
    //now we have to send to the merchant and the client this information
    const { orderId, token, ...rest } = data;
    let updatedOrder = null;
    await axios
      .patch(
        `${API}/api/order/update/${orderId}/${data.deliverer.idDeliverer}/${token}`,
        rest
      )
      .then((res) => {
        // console.log(res.data);
        updatedOrder = res.data;
        console.log("Deliverer accept successfully updated");
      })
      .catch((err) =>
        console.error(`Error at updating order ${orderId} : ${err}`)
      );

    // SEND TO THE MERCHANT
    if (updatedOrder !== null) {
      const merchantIndex = merchantsOpen.findIndex(
        (element) => element.merchantId === updatedOrder.merchant.idMerchant
      );
      if (merchantIndex !== -1) {
        const merchantSocketIds = merchantsOpen[merchantIndex].socketIds;
        for (let socketId in merchantSocketIds) {
          io.to(merchantSocketIds[socketId]).emit(
            "delivererHasTakenOrder",
            updatedOrder
          );
        }
        console.log("Successfully send to merchant");
      } else {
        console.log("Error: Merchant Not Found in merchantsOpen");
        socket.emit("error", "Error: Merchant Not Found in merchantsOpen");
      }

      // SEND TO THE CLIENT
      const clientIndex = clientsList.findIndex(
        (client) => client.clientId === updatedOrder.user.idUser
      );
      if (clientIndex !== -1) {
        const clientSocketIds = clientsList[clientIndex].socketIds;
        for (let socketId in clientSocketIds) {
          io.to(clientSocketIds[socketId]).emit("orderUpdated", updatedOrder);
        }
        console.log("Successfully send to client");
        socket.emit("delivererUpdate", updatedOrder);
        console.log("Successfully send to deliverer");
      } else {
        console.log("Error: Client Not Found in clientList");
        socket.emit("error", "Error: Client Not Found in clientList");
      }
      notif.sendNotificationToClientAndMerchant(updatedOrder);
      socket.emit("delivererUpdate", updatedOrder);
    } else {
      socket.emit("error", `Error at updating order ${orderId}`);
    }
  });

  socket.on("delivererScanMerchant", async (data) => {
    // here we have to send to client and merchant that the deliverer accepted his order
    // then we patch order state

    const { _id, idMerchant, idUser, idDeliverer, token } = data;
    let order = null;
    await axios
      .get(`${API}/api/order/${_id}/${idDeliverer}/${token}`)
      .then((res) => {
        // console.log(res.data)
        order = res.data;
      })
      .catch((err) => {
        console.error(`Error at getting info for order ${_id} : ${err}`);
        socket.emit("scanError", `Error at getting info for order ${_id}`);
      });

    if (order !== null) {
      if (
        order._id === _id &&
        order.user.idUser === idUser &&
        order.merchant.idMerchant === idMerchant &&
        order.deliverer.idDeliverer === idDeliverer
      ) {
        // Jusqu'ici tout va bien
        console.log("success !");
        let updatedOrder = null;
        await axios
          .patch(`${API}/api/order/update/${_id}/${idDeliverer}/${token}`, {
            state: "inProgress",
          })
          .then((res) => {
            console.log(`Successfully order ${_id} updated`);
            updatedOrder = res.data;
          })
          .catch((err) => {
            console.error(`Error at updateting info for order ${_id} : ${err}`);
            socket.emit("scanError", `Error at updating info for order ${_id}`);
          });
        if (updatedOrder !== null) {
          // Send to the client
          const clientIndex = clientsList.findIndex(
            (client) => client.clientId === updatedOrder.user.idUser
          );
          if (clientIndex !== -1) {
            const clientSocketIds = clientsList[clientIndex].socketIds;
            for (let socketId in clientSocketIds) {
              io.to(clientSocketIds[socketId]).emit(
                "orderUpdated",
                updatedOrder
              );
            }
            notif.sendNotificationToClientForDelivery(updatedOrder);
            console.log("Successfully send to client");
          } else {
            console.log("Error: Client Not Found in clientList");
            socket.emit("scanError", "Error: Client Not Found in clientList");
          }

          // Send to the Merchant
          const merchantIndex = merchantsOpen.findIndex(
            (element) => element.merchantId === updatedOrder.merchant.idMerchant
          );
          if (merchantIndex !== -1) {
            const merchantSocketIds = merchantsOpen[merchantIndex].socketIds;
            for (let socketId in merchantSocketIds) {
              io.to(merchantSocketIds[socketId]).emit(
                "delivererHasScannedOrder",
                updatedOrder
              );
            }
            console.log("Successfully send to merchant");
          } else {
            console.log("Error: Merchant Not Found in merchantsOpen");
            socket.emit(
              "scanError",
              "Error: Merchant Not Found in merchantsOpen"
            );
          }
          socket.emit("delivererUpdate", updatedOrder);
        }
      } else {
        console.log("Tentative de scan d'une mauvaise commande !!");
        socket.emit("scanError", { error: "Wrong Order !" });
      }
    }
  });

  socket.on("delivererScanClient", async (data) => {
    // here we have to send to client and merchant that the deliverer accepted his order
    // then we patch order state

    const { _id, idMerchant, idUser, idDeliverer, token } = data;
    let order = null;
    await axios
      .get(`${API}/api/order/${_id}/${idDeliverer}/${token}`)
      .then((res) => {
        // console.log(res.data)
        order = res.data;
      })
      .catch((err) => {
        console.error(`Error at getting info for order ${_id} : ${err}`);
        socket.emit("scanError", `Error at getting info for order ${_id}`);
      });

    if (order !== null) {
      if (
        order._id === _id &&
        order.user.idUser === idUser &&
        order.merchant.idMerchant === idMerchant &&
        order.deliverer.idDeliverer === idDeliverer
      ) {
        let updatedOrder = null;
        await axios
          .patch(`${API}/api/order/update/${_id}/${idDeliverer}/${token}`, {
            state: "done",
          })
          .then((res) => {
            console.log(
              `Successfully order ${_id} updated with state ${res.data.state}`
            );
            updatedOrder = res.data;
          })
          .catch((err) => {
            console.error(`Error at updateting info for order ${_id} : ${err}`);
            socket.emit("scanError", `Error at updating info for order ${_id}`);
          });
        if (updatedOrder !== null) {
          // Send to the client
          const clientIndex = clientsList.findIndex(
            (client) => client.clientId === updatedOrder.user.idUser
          );
          if (clientIndex !== -1) {
            const clientSocketIds = clientsList[clientIndex].socketIds;
            for (let socketId in clientSocketIds) {
              io.to(clientSocketIds[socketId]).emit(
                "orderUpdated",
                updatedOrder
              );
            }
            console.log("Successfully send to client");
          } else {
            console.log("Error: Client Not Found in clientList");
            socket.emit("scanError", "Error: Client Not Found in clientList");
          }

          // Send to the Merchant
          const merchantIndex = merchantsOpen.findIndex(
            (element) => element.merchantId === updatedOrder.merchant.idMerchant
          );
          if (merchantIndex !== -1) {
            const merchantSocketIds = merchantsOpen[merchantIndex].socketIds;
            for (let socketId in merchantSocketIds) {
              io.to(merchantSocketIds[socketId]).emit(
                "delivererHasScannedOrder",
                updatedOrder
              );
            }
            console.log("Successfully send to merchant");
          } else {
            console.log("Error: Merchant Not Found in merchantsOpen");
            socket.emit(
              "scanError",
              "Error: Merchant Not Found in merchantsOpen"
            );
          }
          socket.emit("delivererUpdate", updatedOrder);
        }
      } else {
        console.log("Tentative de scan d'une mauvaise commande !!");
        socket.emit("scanError", { error: "Wrong Order !" });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Orders server has started at : http://localhost:${PORT}`);
});
