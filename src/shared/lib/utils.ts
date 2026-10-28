export { cn } from "cn"

const key = "atlashub_device_id"

export function getDeviceFingerprint(): string {
  let deviceId = localStorage.getItem(key)

  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem(key, deviceId)
  }

  return deviceId
}
