import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Contact from "@/model/Contact";
/*import Joi from "joi";

const bookmark = Joi.object({
    userID: Joi.string().required(),
    contactEmail: Joi.string().required(),
    contactFullName: Joi.string().required(),
    contactDescription: Joi.string().required()
})
*/
export const dynamic  = 'force-dynamic'

export async function POST(req: Request) {
    try {
        await connectDB();
        const isAuthenticated = await AuthCheck(req);

        //if (isAuthenticated) {
            const data = await req.json();
            const { contactFullName, contactEmail, contactType, contactDescription } = data;
/*
            const { error } = Contact.validate({ contactEmail, contactFullName });
            if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
*/
            const findContact = await Contact.find({ contactFullName: contactFullName, contactEmail: contactEmail, contactDescription: contactDescription, contactType: contactType });
            if (findContact?.length > 0) return NextResponse.json({ success: false, message: "Le message a déjà été envoyé dans les contacts" })

            const saveData = await Contact.create(data);

            if (saveData) {
                return NextResponse.json({ success: true, message: "Le message a bien été ajouté aux contacts." });
            } else {
                return NextResponse.json({ success: false, message: "Failed to add contact to backend. Please try again!" });
            }
        //} else {
        //    return NextResponse.json({ success: false, message: "You are not authorized Please login!" });
        //}
    } catch (error) {
        console.log('Error in adding a contact to backend :', error);
        return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
    }
}
