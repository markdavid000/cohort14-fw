import { useApp } from "../../context/AppContext";
import { CreatePropertyModal } from "./CreatePropertyModal";
import { BuyPropertyModal } from "./BuyPropertyModal";
import { ConfirmActionModal } from "./ConfirmActionModal";

export function ModalManager() {
  const { activeModal } = useApp();

  if (!activeModal) return null;

  switch (activeModal) {
    case "createProperty":
      return <CreatePropertyModal />;
    case "buyProperty":
      return <BuyPropertyModal />;
    case "listProperty":
    case "unlistProperty":
    case "deleteProperty":
      return <ConfirmActionModal />;
    default:
      return null;
  }
}
