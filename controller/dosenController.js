const { Dosen, Account, sequelize } = require("../models");
const { responseMessage,internalError } = require("../utils/responseHandle");
const bcrypt = require("bcryptjs");

async function addDosen(req, res) {
  try{

    const { nidn, nm_dosen } = req.body;
    const existingNidn = await Dosen.findOne({ where: { nidn: nidn } });
  const t = await sequelize.transaction();

  if (existingNidn) {
    return responseMessage(
      res,
      400,
      "dosen dengan nidn ini sudah ada",
      "false"
    );
  }
  const dosenResult = await Dosen.create(
    {
      nidn: nidn,
      nm_dosen: nm_dosen,
    },
    { transaction: t }
  );
  //   console.log("Result", mahasiswaResult);
  const name = dosenResult.dataValues.nm_dosen.replace(/\s+/g, "_");
  const dosen_id = dosenResult.dataValues.id;
  
  const defaultPw = name + "123";

  const passwordHash = await bcrypt.hash(defaultPw, 10);
  await Account.create(
    {
      owner: dosen_id,
      username: nidn,
      password: passwordHash,
      role:"dosen"
    },
    { transaction: t }
    );
    await t.commit();
    
    return responseMessage(res, 200, "data dosen added succes", "false");
  }catch(error){
    console.error("Error adding DOsen:", error);

    if (t) await t.rollback();

    return internalError(res);
  }
  }
module.exports = {
  addDosen,
};
