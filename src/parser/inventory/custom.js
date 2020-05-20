import DICTIONARY from "../dictionary.js";
import utils from "../../utils.js";

/**
 * Gets the sourcebook for a subset of dndbeyond sources
 * @param {obj} data Item data
 */
let getSource = (data) => {
  return "Custom Item";
};

/**
 * Checks if the character can attune to an item and if yes, if he is attuned to it.
 */
let getAttuned = (data) => {
  if (
    data.definition.canAttune !== undefined &&
    data.definition.canAttune === true
  )
    return data.isAttuned;
};

/**
 * Checks if the character can equip an item and if yes, if he is has it currently equipped.
 */
let getEquipped = (data) => {
  if (
    data.definition.canEquip !== undefined &&
    data.definition.canEquip === true
  )
    return data.equipped;
};

export default function parseCustomItem(data, character) {
  /**
   * MAIN parseCustomItem
   */
  let customItem = {
    name: data.definition.name,
    type: "loot",
    data: JSON.parse(utils.getTemplate("loot")),
    flags: {
      vtta: {
        dndbeyond: {
          type: "Custom Item",
        },
      },
    },
  };

  let description = data.definition.description
    ? data.definition.description
    : "";
  description = data.definition.notes
    ? description + `<p><blockquote>${data.definition.notes}</blockquote></p>`
    : description;

  customItem.data.description = {
    value: description,
    chat: description,
    unidentified: description,
  };

  /* source: '', */
  customItem.data.source = getSource(data);

  /* quantity: 1, */
  customItem.data.quantity = data.definition.quantity
    ? data.definition.quantity
    : 1;

  /* weight */
  //loot.data.weight = data.definition.weight ? data.definition.weight : 0;
  let bundleSize = data.definition.bundleSize ? data.definition.bundleSize : 1;
  let totalWeight = data.definition.weight ? data.definition.weight : 0;
  customItem.data.weight = totalWeight / bundleSize; //;* (loot.data.quantity / bundleSize);

  /* price */
  customItem.data.price = data.definition.cost ? data.definition.cost : 0;

  /* attuned: false, */
  customItem.data.attuned = false;

  /* equipped: false, */
  customItem.data.equipped = false;

  /* identified: true, */
  customItem.data.identified = true;

  return customItem;
}