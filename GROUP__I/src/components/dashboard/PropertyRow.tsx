import { useNavigate } from "react-router-dom";
import { type Property } from "../../types";
import { formatPrice } from "../../utils/helpers";
import { Badge } from "../ui/Badge";
import { getPropertyImage } from "../../context/AppContext";

interface PropertyRowProps {
  property: Property;
  onList: (id: number) => void;
  onUnlist: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PropertyRow({
  property,
  onList,
  onUnlist,
  onDelete,
}: PropertyRowProps) {
  const navigate = useNavigate();
  const { url } = getPropertyImage(property.id);

  const status = property.isSold ? (
    <Badge variant="sold">Sold</Badge>
  ) : property.isListed ? (
    <Badge variant="listed">
      <span className="material-symbols-outlined filled text-[12px]">
        check_circle
      </span>{" "}
      Listed
    </Badge>
  ) : (
    <Badge variant="unlisted">
      <span className="material-symbols-outlined text-[12px]">inventory_2</span>{" "}
      Vaulted
    </Badge>
  );

  return (
    <tr className="hover:bg-surface-container-high transition-colors">
      <td className="px-4 md:px-6 py-5">
        <div className="flex items-center gap-3 md:gap-4">
          <div
            className="w-12 h-12 rounded bg-surface-container-highest overflow-hidden cursor-pointer shrink-0"
            onClick={() => navigate(`/property/${property.id}`)}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <p
              className="font-headline font-bold text-on-surface cursor-pointer hover:text-primary transition-colors truncate"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              {property.propType} #{property.id}
            </p>
            <p className="text-xs text-on-surface-variant font-label">
              ID: OP-{property.id.toString().padStart(4, "0")}
            </p>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-medium font-body">
            {property.propType}
          </span>
          <span className="text-xs text-on-surface-variant font-body">
            {property.category}
          </span>
        </div>
      </td>
      <td className="hidden sm:table-cell px-6 py-5">
        <p className="font-headline font-bold text-primary">
          {formatPrice(property.price)}
        </p>
      </td>
      <td className="px-4 md:px-6 py-5">{status}</td>
      <td className="px-4 md:px-6 py-5 text-right">
        <div className="flex justify-end gap-2 md:gap-3">
          {!property.isSold && !property.isListed && (
            <button
              className="text-primary hover:underline transition-all font-bold font-label text-sm"
              onClick={() => onList(property.id)}
            >
              List
            </button>
          )}
          {!property.isSold && property.isListed && (
            <button
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-sm"
              onClick={() => onUnlist(property.id)}
            >
              Unlist
            </button>
          )}
          {!property.isSold && !property.isListed && (
            <button
              className="text-on-surface-variant hover:text-error transition-colors font-label text-sm"
              onClick={() => onDelete(property.id)}
            >
              Delete
            </button>
          )}
          <button
            className="text-on-surface-variant hover:text-primary transition-colors font-label text-sm hidden md:block"
            onClick={() => navigate(`/property/${property.id}`)}
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}
