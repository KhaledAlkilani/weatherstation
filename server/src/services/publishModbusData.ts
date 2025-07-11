import fs from "fs";
import path from "path";
import { mqttClient } from "./mqttClient";

const configPath = path.resolve(__dirname, "../PLC.Config/modbusTopics.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

export function publishModbusData(rawData: number[]) {
  config.modbus.registers.forEach((register: any, i: number) => {
    if (rawData[i] !== undefined) {
      const scaled = rawData[i] * register.scale;
      const formatted = `${Math.round(scaled)} ${register.unit}`;
      mqttClient.publish(register.topic, formatted);
    }
  });
}
