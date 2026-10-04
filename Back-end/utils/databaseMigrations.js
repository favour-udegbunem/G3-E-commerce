const tableExists = async (queryInterface, tableName) => {
  try {
    await queryInterface.describeTable(tableName);
    return true;
  } catch {
    return false;
  }
};

const addColumnIfMissing = async (queryInterface, tableName, columns, columnName) => {
  const existing = await queryInterface.describeTable(tableName);
  if (!existing[columnName]) {
    await queryInterface.addColumn(tableName, columnName, columns[columnName]);
    console.log(`🛠️ Added ${tableName}.${columnName}`);
  }
};

export const runDatabaseMigrations = async (sequelize, Sequelize) => {
  const queryInterface = sequelize.getQueryInterface();

  // An earlier development version accidentally created order_items with the
  // Order model's columns. Preserve that table instead of destroying data,
  // then let Sequelize create the correct order_items table from the model.
  if (await tableExists(queryInterface, "order_items")) {
    const columns = await queryInterface.describeTable("order_items");
    const isLegacyOrderTable = !columns.productId || !columns.quantity || !columns.unitPrice;

    if (isLegacyOrderTable) {
      const legacyName = `order_items_legacy_${Date.now()}`;
      await queryInterface.renameTable("order_items", legacyName);
      console.log(`🧰 Preserved legacy order_items as ${legacyName}`);
    }
  }

  await sequelize.sync();

  if (await tableExists(queryInterface, "users")) {
    await addColumnIfMissing(
      queryInterface,
      "users",
      {
        role: {
          type: Sequelize.ENUM("customer", "admin"),
          allowNull: false,
          defaultValue: "customer",
        },
      },
      "role"
    );
  }

  if (await tableExists(queryInterface, "products")) {
    await addColumnIfMissing(
      queryInterface,
      "products",
      {
        type: {
          type: Sequelize.ENUM("item", "package"),
          allowNull: false,
          defaultValue: "item",
        },
        occasion: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        ageRange: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        contents: {
          type: Sequelize.JSON,
          allowNull: true,
        },
      },
      "type"
    );
    await addColumnIfMissing(
      queryInterface,
      "products",
      {
        occasion: { type: Sequelize.STRING(100), allowNull: true },
      },
      "occasion"
    );
    await addColumnIfMissing(
      queryInterface,
      "products",
      {
        ageRange: { type: Sequelize.STRING(100), allowNull: true },
      },
      "ageRange"
    );
    await addColumnIfMissing(
      queryInterface,
      "products",
      {
        contents: { type: Sequelize.JSON, allowNull: true },
      },
      "contents"
    );
  }

  if (await tableExists(queryInterface, "orders")) {
    await addColumnIfMissing(
      queryInterface,
      "orders",
      {
        paymentMethod: { type: Sequelize.STRING(50), allowNull: true },
      },
      "paymentMethod"
    );
    await addColumnIfMissing(
      queryInterface,
      "orders",
      {
        paymentReference: { type: Sequelize.STRING(150), allowNull: true, unique: true },
      },
      "paymentReference"
    );
    await addColumnIfMissing(
      queryInterface,
      "orders",
      {
        paidAt: { type: Sequelize.DATE, allowNull: true },
      },
      "paidAt"
    );
  }

  // A second sync creates any tables renamed above and picks up model-level
  // indexes/associations without using destructive alter:true.
  await sequelize.sync();
};
