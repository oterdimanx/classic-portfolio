import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    contactType: {
        type: String,
        required: true,
        default: 'Commerciale',
    },    
    contactDescription : {
        type: String,
        required: true,
        default: 'Votre Texte',
    }, 
    contactFullName : {
        type: String,
        required: true,
        default: 'Votre Nom Complet',
    }, 
    contactEmail : {
        type: String,
        required: true,
        default: 'Votre Adresse Email',
    }, 

}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export default Contact;