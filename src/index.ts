import dotenv from "dotenv";
import { checkMessage, clientCheck, clientLogin } from "./discord";

dotenv.config();

checkMessage();

clientCheck();

clientLogin();