import mongoose from "mongoose";
import map from 'mongoose-autopopulate'

export class SchemaBuilder {
  constructor(model = {}, options = {}, plugins = []) {
    this.model = model
    this.options = options
    this.plugins = plugins
  }

  setModel (model) {
    this.model = model
    return this
  }

  setModelField (field, props) {
    this.model[field] = props
    return this
  }
  setOptions (options) {
    this.options = options
    return this
  }

  setOptionsField (field, props) {
    this.options[field] = props
    return this
  }

  addPlugins (plugins) {
    this.plugins.push(plugins)
    return this
  }

  getModel () { return this.model }
  getOptions () { return this.options }
  getPlugins () { return this.plugins }

  build () { return [this.model, this.options, this.plugins] }
}

const getSchema = (model, options, plugins = []) => {
  const modelSchema = new mongoose.Schema(
    {
      ...model,
      deleted: { type: Boolean, default: false },
    },
    {
      ...options,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      timestamps: true,
    }
  );
  modelSchema.index({ "$**": "text" });
  if (Array.isArray(plugins))
    plugins.forEach(p => {
      try {
        modelSchema.plugin(p)
      } catch (err) {
        console.log(`Schema Plugin Error: ${err.message}\n`, err)
      }
    });
  // modelSchema.plugin(map);
  return modelSchema
}

export const createModel = (model, options, plugins, name, dbName = `${name}s`) => mongoose.model(name, getSchema(model, options, plugins), dbName)

export const buildModel = (schema, name, dbName) => createModel(...schema, name, dbName)

export const saveModel = (Model, data) => (new Model(data)).save()

export default create = (model, name, dbName) => createModel(...SchemaBuilder(model).addPlugins(map).build(), name, dbName)
