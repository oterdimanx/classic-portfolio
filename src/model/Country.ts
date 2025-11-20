import mongoose from "mongoose"

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  flag: { type: String, required: true },
  iso2: { type: String, required: true, maxlength: 2 },
  dialCode: { type: String, required: true }
});

const Country = mongoose.models.Country || mongoose.model('Country', CountrySchema);
export default Country;