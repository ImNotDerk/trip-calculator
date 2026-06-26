import { useAppContext } from "../context/AppContext";

export function GasPriceInput() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label
        htmlFor="gas-price"
        className="text-sm text-muted whitespace-nowrap"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
      >
        Gas Price (per L)
      </label>
      <div className="relative w-full sm:w-32">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft text-sm">
          ₱
        </span>
        <input
          id="gas-price"
          type="number"
          min="0"
          step="0.01"
          value={state.gasPrice || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_GAS_PRICE",
              price: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="0.00"
          className="h-10 w-full rounded-md border border-hairline bg-canvas pl-8 pr-3.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/15"
          style={{ fontFamily: "Inter, sans-serif" }}
        />
      </div>
    </div>
  );
}
