const trigger = {
    tags: ["Schedule"],
    description: "Trigger schedule manually",
    responses: {
        default: {
            description: "Schedule triggered successfuly",
        },
    },
};

export default {
    "/schedule": {
        get: trigger,
    },
};
