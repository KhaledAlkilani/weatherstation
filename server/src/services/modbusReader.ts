import ModbusRTU from "modbus-serial";
import { publishModbusData } from "../services/publishModbusData";

const client = new ModbusRTU();

export async function startModbusPolling() {
  await client.connectTCP("127.0.0.1", { port: 502 });
  client.setID(1);

  setInterval(async () => {
    try {
      const { data } = await client.readHoldingRegisters(0, 3); // Read 3 registers starting from address 0
      publishModbusData(data);
    } catch (err) {
      console.error("Modbus read error:", err);
    }
  }, 5000); // poll every 5 seconds
}
