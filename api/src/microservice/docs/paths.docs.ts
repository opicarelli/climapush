import users from "./usecases/users.docs";
import schedule from "./usecases/schedule.docs";

const paths = {
    ...users,
    ...schedule,
};

export default paths;
