import { Position } from "../models/position";

export interface Parser {
    parse(fqp: string): Position[];
}