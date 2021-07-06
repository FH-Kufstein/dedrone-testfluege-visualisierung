import { Point } from "gpx-builder/dist/builder/BaseBuilder/models";

export interface Parser {
    read(fqp: string): Point[];
}