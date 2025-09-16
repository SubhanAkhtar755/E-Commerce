import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    image: {
      url: { type: String },
      public_id: { type: String },
    },

    // 📞 User's main phone number
    number: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(\+92|0)?[0-9]{10,11}$/.test(v); // Pakistan number format
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    // 🏠 Address sub-fields
    address: {
      street: { type: String }, // House no, Street
      city: { type: String},
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "Pakistan" },
      phone: { type: String }, // optional secondary contact
    },

    // 🎂 Birthday (Date type)
    birthday: {
      type: Date,
    },

    // ⚧ Gender (Enum restrict)
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model("User", dataSchema);
export default Model;
