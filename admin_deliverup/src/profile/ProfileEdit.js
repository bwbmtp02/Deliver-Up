import React from "react";
import { Edit, SelectInput, SimpleForm, required } from "react-admin";

const Languages = [
    { id: "en", name: "English" },
    { id: "fr", name: "French" },
];

const ProfileEdit = ({ staticContext, ...props }) => {
    return (
        <Edit
            /*
                As we are not coming for a route generated by a Resource component,
                we have to provide the id ourselves.
                As there is only one config for the current user, we decided to
                hardcode it here
            */
            id="my-config"
            /*
                For the same reason, we need to provide the resource and basePath props
                which are required by the Edit component
            */
            resource="profile"
            basePath="/my-profile"
            redirect={false}
            title="My profile"
            {...props}
        >
            <SimpleForm>
                <SelectInput
                    source="language"
                    choices={Languages}
                    validate={required()}
                />
            </SimpleForm>
        </Edit>
    );
};

export default ProfileEdit;
