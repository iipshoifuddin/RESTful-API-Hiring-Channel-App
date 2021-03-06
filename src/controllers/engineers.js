// import dependencies
const uuidv4 = require("uuid/v4");
const db = require("../configs/db");
// import model
const engineersModel = require("../models/engineers");
const responseHelper = require("../helper/response");
require("dotenv").config();

module.exports = {
  getEngineers: (req, res) => {
    const searchBy = req.query.searchBy ? req.query.searchBy : "name";
    const searchValue = req.query.searchValue ? req.query.searchValue : "";
    const sort = req.query.sort ? req.query.sort : "name";
    const order = req.query.order ? req.query.order : "asc";
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 12;

    const offset = (page - 1) * limit;
    let totalRow = 0;
    let totalPage = 0;

    const sqlTotalPageRow = `SELECT COUNT(*) totalRow FROM engineer WHERE ${searchBy} like '%${searchValue}%'`;

    db.query(sqlTotalPageRow, (err, result) => {
      totalRow = result[0].totalRow;
      totalPage = totalRow / limit;
      if (totalRow % limit > 0) {
        totalPage = parseInt(totalPage) + 1;
      }

      const prevPage = parseInt(page) === 1 ? 1 : parseInt(page) - 1;
      const nextPage =
        parseInt(page) === totalPage ? totalPage : parseInt(page) + 1;

      const pageDetail = [
        {
          totalRow,
          totalPage: totalPage,
          perPage: limit,
          currentPage: page,
          prevLink: `${req.hostname}:${
            process.env.PORT
          }${req.originalUrl.replace(
            "page=" + page,
            "page=" + parseInt(prevPage)
          )}`,
          nextLink:
            req.originalUrl.indexOf("page") === -1 &&
            req.originalUrl.indexOf("?") === -1
              ? `${req.hostname}:${process.env.PORT}${req.originalUrl +
                  "?page=" +
                  parseInt(nextPage)}`
              : req.originalUrl.indexOf("page") === -1 &&
                req.originalUrl.indexOf("?") > -1
              ? `${req.hostname}:${process.env.PORT}${req.originalUrl +
                  "&page=" +
                  parseInt(nextPage)}`
              : `${req.hostname}:${process.env.PORT}${req.originalUrl.replace(
                  "page=" + page,
                  "page=" + parseInt(nextPage)
                )}`
        }
      ];

      if (page > totalPage) {
        return responseHelper.response(
          res,
          400,
          true,
          `Page Not Found. Total Page is only ${totalPage}`
        );
      } else {
        engineersModel
          .getEngineers(searchBy, searchValue, sort, order, offset, limit)
          .then(result => {
            return responseHelper.response(
              res,
              200,
              false,
              "Success get engineers",
              pageDetail,
              result
            );
          })
          .catch(err => {
            return responseHelper.response(
              res,
              400,
              true,
              "Error get engineers"
            );
          });
      }
    });
  },
  getEngineerbyId: (req, res) => {
    const id = req.params.id;
    engineersModel
      .getEngineerbyId(id)
      .then(result => {
        return responseHelper.response(
          res,
          200,
          false,
          `Success get engineer with id: ${id}`,
          {},
          result
        );
      })
      .catch(err => {
        return responseHelper.response(
          res,
          400,
          true,
          `Error get engineer with id: ${id}`
        );
      });
  },
  createEngineer: (req, res) => {
    const id = uuidv4();
    const {
      email,
      password,
      name,
      description,
      skill,
      location,
      date_of_birth,
      expected_salary,
      showcase
    } = req.body;
    const image = typeof req.file !== "undefined" ? req.file.filename : "";
    const date_created = new Date();
    const date_updated = new Date();
    const data = {
      id,
      email,
      password,
      name,
      image,
      description,
      skill,
      location,
      date_of_birth,
      expected_salary,
      showcase,
      date_created,
      date_updated
    };

    engineersModel
      .createEngineer(data)
      .then(result => {
        return responseHelper.response(
          res,
          200,
          false,
          "Success create a new engineer",
          {},
          data
        );
      })
      .catch(err => {
        return responseHelper.response(
          res,
          400,
          true,
          "Error create a new engineer"
        );
      });
  },
  updateEngineer: (req, res) => {
    const id = req.params.id;
    const {
      email,
      password,
      name,
      description,
      skill,
      location,
      date_of_birth,
      expected_salary,
      showcase
    } = req.body;
    const image =
      typeof req.file !== "undefined" ? req.file.filename : req.body.image;
    const date_updated = new Date();
    const data = {
      id,
      email,
      password,
      name,
      image,
      description,
      skill,
      location,
      date_of_birth,
      expected_salary,
      showcase,
      date_updated
    };
    engineersModel
      .updateEngineer(data, id)
      .then(result => {
        return responseHelper.response(
          res,
          200,
          false,
          `Success update engineer with id: ${id}`,
          {},
          data
        );
      })
      .catch(err => {
        return responseHelper.response(
          res,
          400,
          true,
          `Error update engineer with id: ${id}`
        );
      });
  },
  deleteEngineer: (req, res) => {
    const id = req.params.id;
    engineersModel
      .deleteEngineer(id)
      .then(result => {
        return responseHelper.response(
          res,
          200,
          false,
          `Success delete engineer with id: ${id}`
        );
      })
      .catch(err => {
        return responseHelper.response(
          res,
          400,
          true,
          `Error delete engineer with id: ${id}`
        );
      });
  }
};
