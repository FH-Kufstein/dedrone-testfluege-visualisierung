import { Position } from "../../models";

export interface Parser {
    read(fqp: string): Position[];
}