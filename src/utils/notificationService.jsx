import { createRoot } from "react-dom/client";
import Notification from "../common/Notification";
export const notifyAlert = ({
  title = "Info",
  message = "",
  phone = "",
  position = "bottom-right",
  type = "info",
}) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const handleClose = () => {
    root.unmount();
    container.remove();
  };

  root.render(
    <Notification
      title={title}
      message={message}
      phone={phone}
      position={position}
      onClose={handleClose}
      type={type}
    />,
  );
};
