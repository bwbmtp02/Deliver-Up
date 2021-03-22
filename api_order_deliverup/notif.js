const fetch = require("node-fetch");

// Notif to merchant
exports.sendNotificationToMerchant = async (data) => {
  const message = {
    to: data.merchant.expoToken,
    sound: "default",
    title: `Commande n°${data._id}`,
    body: `${data.user.firstName} vous a passé une nouvelle commande`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}; // End of function

// Notify client when order is accepted by merchant
exports.sendNotificationToClientForOrder = async (data) => {
  const message = {
    to: data.user.expoToken,
    sound: "default",
    title: `Commande n°${data._id}`,
    body: `${data.merchant.enterprise} a accepté votre commande`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}; // End of function

// Notif to client & merchant
exports.sendNotificationToClientAndMerchant = async (data) => {
  const messageToMerchant = {
    to: data.merchant.expoToken,
    sound: "default",
    title: `Prise en charge commande n°${data._id}`,
    body: `${data.deliverer.firstName} va venir récupérer la commande n°${data._id} ! \n Veuillez la préparer s'il vous plait`,
  };

  const messageToUser = {
    to: data.user.expoToken,
    sound: "default",
    title: `Prise en charge commande n°${data._id}`,
    body: `${data.deliverer.firstName} va s'occuper de vous livrer la commande n°${data._id} ! \n Vous pouvez désormais discuter ensemble dans votre messagerie personnelle`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageToMerchant),
  });

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageToUser),
  });
};

// Notify client when order is in delivery
exports.sendNotificationToClientForDelivery = async (data) => {
  const message = {
    to: data.user.expoToken,
    sound: "default",
    title: `Commande n°${data._id}`,
    body: `${data.deliverer.firstName} a récupéré votre commande \n Veuillez rester disponible s'il vous plait !`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

// Notify client for new message
exports.sendNotificationToClientForNewMessage = async (data) => {
  const message = {
    to: data.user.expoToken,
    sound: "default",
    title: `Nouveau message `,
    body: `${data.deliverer.firstName} vous a envoyé un nouveau message`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

// Notify deliverer for new message
exports.sendNotificationToDelivererForNewMessage = async (data) => {
  const message = {
    to: data.deliverer.expoToken,
    sound: "default",
    title: `Nouveau message `,
    body: `${data.user.firstName} vous a envoyé un nouveau message`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
