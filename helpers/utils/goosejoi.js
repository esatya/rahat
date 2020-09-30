const Joi = require('joi');

const GooseJoi = {

  payload(joiSchema, options = {}) {
    return {
      payload: Joi.object(joiSchema).options(options),
    };
  },

  id(description, example) {
    let id = Joi.string().required();
    id = description ? id.description(description) : id.description('Resource identifier');
    id = example ? id.example(example) : id;
    return Joi.object({ id });
  },

  params(joiSchema, options = {}) {
    return {
      params: Joi.object(joiSchema).options(options),
    };
  },

  query(joiSchema, options = {}) {
    return {
      query: Joi.object(joiSchema).options(options),
    };
  },

  convert(model) {
    const { paths } = model.schema;
    const jModel = {};
    Object.keys(paths).forEach((k) => {
      const el = paths[k];
      let jel = GooseJoi.mapTypes(el.instance);

      if (el.options.joi) jel = el.options.joi;
      if (jel) {
        jel = el.options.description ? jel.description(el.options.description) : jel;
        jel = el.isRequired ? jel.required() : jel.optional();
        jel = el.options.default ? jel.default(el.options.default) : jel;
        jel = el.options.enum ? jel.valid(...el.options.enum) : jel;
        jModel[k] = jel;
      }
    });
    jModel.id = Joi.string().required().description('Record id');
    return jModel;
  },

  getPathArray(paths) {
    const retPaths = [];
    Object.keys(paths).forEach((d) => {
      const obj = paths[d];
      if (obj.path !== '_id' && obj.path !== 'created_at' && obj.path !== 'updated_at' && obj.path !== '__v') retPaths.push(obj);
    });
    return retPaths;
  },

  mapTypes(elInstance) {
    if (elInstance === 'String') return Joi.string();
    if (elInstance === 'Number') return Joi.number();
    if (elInstance === 'Boolean') return Joi.bool();
    if (elInstance === 'Date') return Joi.date();
    if (elInstance === 'Array') return Joi.array();
    if (elInstance === 'Mixed') return Joi.object();
    return null;
  },
};

module.exports = GooseJoi;
