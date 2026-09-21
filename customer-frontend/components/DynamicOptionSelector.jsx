'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  ChevronDown 
} from 'lucide-react';

/**
 * DynamicOptionSelector
 * Renders arbitrary customizable product attributes (Size, Weight, Quality, Consecration)
 * Recalculates live final price, enforces validation, and prepares order snapshot.
 */
export default function DynamicOptionSelector({
  product,
  onAddToCart,
  onBuyNow,
  currency = '₹',
}) {
  const basePrice = useMemo(() => {
    return parseFloat(product?.base_price || product?.price || 0);
  }, [product]);

  const options = useMemo(() => {
    return product?.product_options || [];
  }, [product]);

  // Selections state: { [option_name]: { valueId, label, price_adjustment } }
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    if (options && options.length > 0) {
      options.forEach((opt) => {
        if (opt.product_option_values && opt.product_option_values.length > 0) {
          // Default to first choice for required radio/select
          const defaultVal = opt.product_option_values[0];
          initial[opt.option_name] = {
            optionId: opt.id,
            valueId: defaultVal.id,
            label: defaultVal.label,
            price_adjustment: parseFloat(defaultVal.price_adjustment || 0),
          };
        } else if (opt.input_type === 'text') {
          initial[opt.option_name] = {
            optionId: opt.id,
            valueId: null,
            label: '',
            price_adjustment: 0,
          };
        }
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Compute live price surcharge
  const { totalSurcharge, finalUnitPrice, finalTotalPrice } = useMemo(() => {
    let surcharge = 0;
    Object.values(selectedOptions).forEach((sel) => {
      if (sel && typeof sel.price_adjustment === 'number') {
        surcharge += sel.price_adjustment;
      }
    });

    const unitPrice = Math.max(0, basePrice + surcharge);
    const totalPrice = unitPrice * quantity;

    return {
      totalSurcharge: surcharge,
      finalUnitPrice: unitPrice,
      finalTotalPrice: totalPrice,
    };
  }, [basePrice, selectedOptions, quantity]);

  // Handler for option change
  const handleSelectOption = (option, val) => {
    setValidationError('');
    setSelectedOptions((prev) => ({
      ...prev,
      [option.option_name]: {
        optionId: option.id,
        valueId: val.id,
        label: val.label,
        price_adjustment: parseFloat(val.price_adjustment || 0),
      },
    }));
  };

  // Handler for text input
  const handleTextInput = (option, text) => {
    setValidationError('');
    setSelectedOptions((prev) => ({
      ...prev,
      [option.option_name]: {
        optionId: option.id,
        valueId: null,
        label: text,
        price_adjustment: 0,
      },
    }));
  };

  // Validate all required options
  const validateSelections = () => {
    for (const opt of options) {
      if (opt.is_required) {
        const current = selectedOptions[opt.option_name];
        if (!current || !current.label || current.label.trim() === '') {
          setValidationError(`Please select or configure "${opt.option_name}" before continuing.`);
          return false;
        }
      }
    }
    return true;
  };

  // Prepare standard payload for order_items.selected_attributes
  const getOrderPayload = () => {
    const formattedAttributes = {};
    Object.entries(selectedOptions).forEach(([optName, data]) => {
      const priceTag = data.price_adjustment > 0 ? ` (+${currency}${data.price_adjustment})` : '';
      formattedAttributes[optName] = `${data.label}${priceTag}`;
    });

    return {
      productId: product.id,
      title: product.title || product.name,
      basePrice: basePrice,
      unitPrice: finalUnitPrice,
      totalPrice: finalTotalPrice,
      quantity: quantity,
      selected_attributes: formattedAttributes,
      rawSelections: selectedOptions,
    };
  };

  const handleAddToCart = () => {
    if (!validateSelections()) return;
    const item = getOrderPayload();
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);

    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  const handleBuyNow = () => {
    if (!validateSelections()) return;
    const item = getOrderPayload();
    if (onBuyNow) {
      onBuyNow(item);
    }
  };

  return (
    <div className="bg-[#121118]/90 backdrop-blur-xl border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 text-white">
      {/* Live Price Display */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
            Configured Investment
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {currency}{finalUnitPrice.toLocaleString()}
            </span>
            {totalSurcharge !== 0 && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {totalSurcharge > 0 ? `+${currency}${totalSurcharge} custom additions` : `${currency}${totalSurcharge}`}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-gray-400 block">Base Price</span>
          <span className="text-xs font-mono text-gray-300">
            {currency}{basePrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Dynamic Options List */}
      <div className="space-y-5">
        {options.map((opt) => {
          const currentSelection = selectedOptions[opt.option_name];

          return (
            <div key={opt.id} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-200 font-medium">
                  {opt.option_name}
                  {opt.is_required && <span className="text-[#D4AF37] ml-1">*</span>}
                </span>
                {currentSelection?.label && (
                  <span className="text-[#D4AF37] text-[11px] font-semibold">
                    Selected: {currentSelection.label}
                  </span>
                )}
              </div>

              {/* Radio Pills Mode */}
              {opt.input_type === 'radio' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {opt.product_option_values?.map((val) => {
                    const isSelected = currentSelection?.valueId === val.id;
                    const isOutOfStock = val.stock_quantity === 0;

                    return (
                      <button
                        key={val.id}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleSelectOption(opt, val)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition text-left ${
                          isSelected
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                            : isOutOfStock
                            ? 'bg-black/20 border-white/5 text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-white/[0.03] border-white/10 text-gray-300 hover:border-white/25 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-gray-500'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <span>{val.label}</span>
                        </div>

                        {val.price_adjustment > 0 ? (
                          <span className="text-[11px] text-[#D4AF37] font-semibold">
                            +{currency}{val.price_adjustment}
                          </span>
                        ) : isOutOfStock ? (
                          <span className="text-[10px] text-red-400 uppercase">Sold Out</span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Included</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Dropdown Select Mode */}
              {opt.input_type === 'select' && (
                <div className="relative">
                  <select
                    value={currentSelection?.valueId || ''}
                    onChange={(e) => {
                      const selectedVal = opt.product_option_values.find(
                        (v) => v.id === e.target.value
                      );
                      if (selectedVal) handleSelectOption(opt, selectedVal);
                    }}
                    className="w-full appearance-none px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] pr-10"
                  >
                    <option value="" disabled>
                      Select {opt.option_name}...
                    </option>
                    {opt.product_option_values?.map((val) => (
                      <option key={val.id} value={val.id} className="bg-[#181722] text-white">
                        {val.label}{' '}
                        {val.price_adjustment > 0
                          ? `(+${currency}${val.price_adjustment})`
                          : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              )}

              {/* Freeform Text Mode (e.g. Custom Vedic Name Engraving) */}
              {opt.input_type === 'text' && (
                <input
                  type="text"
                  placeholder={`Enter your custom ${opt.option_name.toLowerCase()}...`}
                  value={currentSelection?.label || ''}
                  onChange={(e) => handleTextInput(opt, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <span className="text-xs font-mono text-gray-300">Quantity</span>
        <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-300 hover:bg-white/10 text-sm font-mono"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-mono font-bold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-300 hover:bg-white/10 text-sm font-mono"
          >
            +
          </button>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono uppercase tracking-wider font-semibold transition"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-black text-xs font-mono uppercase tracking-wider font-bold transition shadow-lg shadow-[#D4AF37]/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-gray-400 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Authenticity Guaranteed
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Vedic Consecration
          </span>
        </div>
      </div>
    </div>
  );
}
