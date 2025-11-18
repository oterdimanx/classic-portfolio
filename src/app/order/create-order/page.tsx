"use client"

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import CartCard from '@/components/CartCard'
import {  get_all_cart_Items } from '@/Services/common/cart'
import { setCart } from '@/utils/CartSlice'
import { setNavActive } from '@/utils/AdminNavSlice'
import { create_a_new_order } from '@/Services/common/order'
import Navbar from '@/components/Navbar'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

type Inputs = {
    fullName: string,
    address: string,
    city: string,
    postalCode: Number,
    country: string,
}

interface userData {
    email: String,
    role: String,
    _id: String,
    name: String
}

type Data = {
    productID: {
        productName: string,
        productPrice: String,
        _id: string,
        productImage: string,
        productQuantity: number,
    }
    userID: {
        email: string,
        _id: string,
    },
    _id: string,
    quantity: number,
}

const countries = [
  { name: "Afghanistan", flag: "🇦🇫", iso2: "AF", dialCode: "+93" },
  { name: "Åland Islands", flag: "🇦🇽", iso2: "AX", dialCode: "+358" },
  { name: "Albania", flag: "🇦🇱", iso2: "AL", dialCode: "+355" },
  { name: "Algeria", flag: "🇩🇿", iso2: "DZ", dialCode: "+213" },
  { name: "American Samoa", flag: "🇦🇸", iso2: "AS", dialCode: "+1684" },
  { name: "Andorra", flag: "🇦🇩", iso2: "AD", dialCode: "+376" },
  { name: "Angola", flag: "🇦🇴", iso2: "AO", dialCode: "+244" },
  { name: "Anguilla", flag: "🇦🇮", iso2: "AI", dialCode: "+1264" },
  { name: "Antarctica", flag: "🇦🇶", iso2: "AQ", dialCode: "+672" },
  { name: "Antigua and Barbuda", flag: "🇦🇬", iso2: "AG", dialCode: "+1268" },
  { name: "Argentina", flag: "🇦🇷", iso2: "AR", dialCode: "+54" },
  { name: "Armenia", flag: "🇦🇲", iso2: "AM", dialCode: "+374" },
  { name: "Aruba", flag: "🇦🇼", iso2: "AW", dialCode: "+297" },
  { name: "Australia", flag: "🇦🇺", iso2: "AU", dialCode: "+61" },
  { name: "Austria", flag: "🇦🇹", iso2: "AT", dialCode: "+43" },
  { name: "Azerbaijan", flag: "🇦🇿", iso2: "AZ", dialCode: "+994" },
  { name: "Bahamas", flag: "🇧🇸", iso2: "BS", dialCode: "+1242" },
  { name: "Bahrain", flag: "🇧🇭", iso2: "BH", dialCode: "+973" },
  { name: "Bangladesh", flag: "🇧🇩", iso2: "BD", dialCode: "+880" },
  { name: "Barbados", flag: "🇧🇧", iso2: "BB", dialCode: "+1246" },
  { name: "Belarus", flag: "🇧🇾", iso2: "BY", dialCode: "+375" },
  { name: "Belgium", flag: "🇧🇪", iso2: "BE", dialCode: "+32" },
  { name: "Belize", flag: "🇧🇿", iso2: "BZ", dialCode: "+501" },
  { name: "Benin", flag: "🇧🇯", iso2: "BJ", dialCode: "+229" },
  { name: "Bermuda", flag: "🇧🇲", iso2: "BM", dialCode: "+1441" },
  { name: "Bhutan", flag: "🇧🇹", iso2: "BT", dialCode: "+975" },
  { name: "Bolivia", flag: "🇧🇴", iso2: "BO", dialCode: "+591" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦", iso2: "BA", dialCode: "+387" },
  { name: "Botswana", flag: "🇧🇼", iso2: "BW", dialCode: "+267" },
  { name: "Bouvet Island", flag: "🇧🇻", iso2: "BV", dialCode: "+47" },
  { name: "Brazil", flag: "🇧🇷", iso2: "BR", dialCode: "+55" },
  { name: "British Indian Ocean Territory", flag: "🇮🇴", iso2: "IO", dialCode: "+246" },
  { name: "Brunei Darussalam", flag: "🇧🇳", iso2: "BN", dialCode: "+673" },
  { name: "Bulgaria", flag: "🇧🇬", iso2: "BG", dialCode: "+359" },
  { name: "Burkina Faso", flag: "🇧🇫", iso2: "BF", dialCode: "+226" },
  { name: "Burundi", flag: "🇧🇮", iso2: "BI", dialCode: "+257" },
  { name: "Cambodia", flag: "🇰🇭", iso2: "KH", dialCode: "+855" },
  { name: "Cameroon", flag: "🇨🇲", iso2: "CM", dialCode: "+237" },
  { name: "Canada", flag: "🇨🇦", iso2: "CA", dialCode: "+1" },
  { name: "Cape Verde", flag: "🇨🇻", iso2: "CV", dialCode: "+238" },
  { name: "Cayman Islands", flag: "🇰🇾", iso2: "KY", dialCode: "+1345" },
  { name: "Central African Republic", flag: "🇨🇫", iso2: "CF", dialCode: "+236" },
  { name: "Chad", flag: "🇹🇩", iso2: "TD", dialCode: "+235" },
  { name: "Chile", flag: "🇨🇱", iso2: "CL", dialCode: "+56" },
  { name: "China", flag: "🇨🇳", iso2: "CN", dialCode: "+86" },
  { name: "Christmas Island", flag: "🇨🇽", iso2: "CX", dialCode: "+61" },
  { name: "Cocos (Keeling) Islands", flag: "🇨🇨", iso2: "CC", dialCode: "+61" },
  { name: "Colombia", flag: "🇨🇴", iso2: "CO", dialCode: "+57" },
  { name: "Comoros", flag: "🇰🇲", iso2: "KM", dialCode: "+269" },
  { name: "Congo", flag: "🇨🇬", iso2: "CG", dialCode: "+242" },
  { name: "Congo, The Democratic Republic of the Congo", flag: "🇨🇩", iso2: "CD", dialCode: "+243" },
  { name: "Cook Islands", flag: "🇨🇰", iso2: "CK", dialCode: "+682" },
  { name: "Costa Rica", flag: "🇨🇷", iso2: "CR", dialCode: "+506" },
  { name: "Côte d'Ivoire", flag: "🇨🇮", iso2: "CI", dialCode: "+225" },
  { name: "Croatia", flag: "🇭🇷", iso2: "HR", dialCode: "+385" },
  { name: "Cuba", flag: "🇨🇺", iso2: "CU", dialCode: "+53" },
  { name: "Cyprus", flag: "🇨🇾", iso2: "CY", dialCode: "+357" },
  { name: "Czech Republic", flag: "🇨🇿", iso2: "CZ", dialCode: "+420" },
  { name: "Denmark", flag: "🇩🇰", iso2: "DK", dialCode: "+45" },
  { name: "Djibouti", flag: "🇩🇯", iso2: "DJ", dialCode: "+253" },
  { name: "Dominica", flag: "🇩🇲", iso2: "DM", dialCode: "+1767" },
  { name: "Dominican Republic", flag: "🇩🇴", iso2: "DO", dialCode: "+1849" },
  { name: "Ecuador", flag: "🇪🇨", iso2: "EC", dialCode: "+593" },
  { name: "Egypt", flag: "🇪🇬", iso2: "EG", dialCode: "+20" },
  { name: "El Salvador", flag: "🇸🇻", iso2: "SV", dialCode: "+503" },
  { name: "Equatorial Guinea", flag: "🇬🇶", iso2: "GQ", dialCode: "+240" },
  { name: "Eritrea", flag: "🇪🇷", iso2: "ER", dialCode: "+291" },
  { name: "Estonia", flag: "🇪🇪", iso2: "EE", dialCode: "+372" },
  { name: "Ethiopia", flag: "🇪🇹", iso2: "ET", dialCode: "+251" },
  { name: "Falkland Islands (Malvinas)", flag: "🇫🇰", iso2: "FK", dialCode: "+500" },
  { name: "Faroe Islands", flag: "🇫🇴", iso2: "FO", dialCode: "+298" },
  { name: "Fiji", flag: "🇫🇯", iso2: "FJ", dialCode: "+679" },
  { name: "Finland", flag: "🇫🇮", iso2: "FI", dialCode: "+358" },
  { name: "France", flag: "🇫🇷", iso2: "FR", dialCode: "+33" },
  { name: "French Guiana", flag: "🇬🇫", iso2: "GF", dialCode: "+594" },
  { name: "French Polynesia", flag: "🇵🇫", iso2: "PF", dialCode: "+689" },
  { name: "French Southern Territories", flag: "🇹🇫", iso2: "TF", dialCode: "+262" },
  { name: "Gabon", flag: "🇬🇦", iso2: "GA", dialCode: "+241" },
  { name: "Gambia", flag: "🇬🇲", iso2: "GM", dialCode: "+220" },
  { name: "Georgia", flag: "🇬🇪", iso2: "GE", dialCode: "+995" },
  { name: "Germany", flag: "🇩🇪", iso2: "DE", dialCode: "+49" },
  { name: "Ghana", flag: "🇬🇭", iso2: "GH", dialCode: "+233" },
  { name: "Gibraltar", flag: "🇬🇮", iso2: "GI", dialCode: "+350" },
  { name: "Greece", flag: "🇬🇷", iso2: "GR", dialCode: "+30" },
  { name: "Greenland", flag: "🇬🇱", iso2: "GL", dialCode: "+299" },
  { name: "Grenada", flag: "🇬🇩", iso2: "GD", dialCode: "+1473" },
  { name: "Guadeloupe", flag: "🇬🇵", iso2: "GP", dialCode: "+590" },
  { name: "Guam", flag: "🇬🇺", iso2: "GU", dialCode: "+1671" },
  { name: "Guatemala", flag: "🇬🇹", iso2: "GT", dialCode: "+502" },
  { name: "Guernsey", flag: "🇬🇬", iso2: "GG", dialCode: "+44" },
  { name: "Guinea", flag: "🇬🇳", iso2: "GN", dialCode: "+224" },
  { name: "Guinea-Bissau", flag: "🇬🇼", iso2: "GW", dialCode: "+245" },
  { name: "Guyana", flag: "🇬🇾", iso2: "GY", dialCode: "+592" },
  { name: "Haiti", flag: "🇭🇹", iso2: "HT", dialCode: "+509" },
  { name: "Heard Island and McDonald Islands", flag: "🇭🇲", iso2: "HM", dialCode: "+672" },
  { name: "Holy See (Vatican City State)", flag: "🇻🇦", iso2: "VA", dialCode: "+379" },
  { name: "Honduras", flag: "🇭🇳", iso2: "HN", dialCode: "+504" },
  { name: "Hong Kong", flag: "🇭🇰", iso2: "HK", dialCode: "+852" },
  { name: "Hungary", flag: "🇭🇺", iso2: "HU", dialCode: "+36" },
  { name: "Iceland", flag: "🇮🇸", iso2: "IS", dialCode: "+354" },
  { name: "India", flag: "🇮🇳", iso2: "IN", dialCode: "+91" },
  { name: "Indonesia", flag: "🇮🇩", iso2: "ID", dialCode: "+62" },
  { name: "Iran, Islamic Republic of Persian Gulf", flag: "🇮🇷", iso2: "IR", dialCode: "+98" },
  { name: "Iraq", flag: "🇮🇶", iso2: "IQ", dialCode: "+964" },
  { name: "Ireland", flag: "🇮🇪", iso2: "IE", dialCode: "+353" },
  { name: "Isle of Man", flag: "🇮🇲", iso2: "IM", dialCode: "+44" },
  { name: "Israel", flag: "🇮🇱", iso2: "IL", dialCode: "+972" },
  { name: "Italy", flag: "🇮🇹", iso2: "IT", dialCode: "+39" },
  { name: "Jamaica", flag: "🇯🇲", iso2: "JM", dialCode: "+1876" },
  { name: "Japan", flag: "🇯🇵", iso2: "JP", dialCode: "+81" },
  { name: "Jersey", flag: "🇯🇪", iso2: "JE", dialCode: "+44" },
  { name: "Jordan", flag: "🇯🇴", iso2: "JO", dialCode: "+962" },
  { name: "Kazakhstan", flag: "🇰🇿", iso2: "KZ", dialCode: "+77" },
  { name: "Kenya", flag: "🇰🇪", iso2: "KE", dialCode: "+254" },
  { name: "Kiribati", flag: "🇰🇮", iso2: "KI", dialCode: "+686" },
  { name: "Korea, Democratic People's Republic of Korea", flag: "🇰🇵", iso2: "KP", dialCode: "+850" },
  { name: "Korea, Republic of South Korea", flag: "🇰🇷", iso2: "KR", dialCode: "+82" },
  { name: "Kosovo", flag: "🇽🇰", iso2: "XK", dialCode: "+383" },
  { name: "Kuwait", flag: "🇰🇼", iso2: "KW", dialCode: "+965" },
  { name: "Kyrgyzstan", flag: "🇰🇬", iso2: "KG", dialCode: "+996" },
  { name: "Laos", flag: "🇱🇦", iso2: "LA", dialCode: "+856" },
  { name: "Latvia", flag: "🇱🇻", iso2: "LV", dialCode: "+371" },
  { name: "Lebanon", flag: "🇱🇧", iso2: "LB", dialCode: "+961" },
  { name: "Lesotho", flag: "🇱🇸", iso2: "LS", dialCode: "+266" },
  { name: "Liberia", flag: "🇱🇷", iso2: "LR", dialCode: "+231" },
  { name: "Libyan Arab Jamahiriya", flag: "🇱🇾", iso2: "LY", dialCode: "+218" },
  { name: "Liechtenstein", flag: "🇱🇮", iso2: "LI", dialCode: "+423" },
  { name: "Lithuania", flag: "🇱🇹", iso2: "LT", dialCode: "+370" },
  { name: "Luxembourg", flag: "🇱🇺", iso2: "LU", dialCode: "+352" },
  { name: "Macao", flag: "🇲🇴", iso2: "MO", dialCode: "+853" },
  { name: "Macedonia", flag: "🇲🇰", iso2: "MK", dialCode: "+389" },
  { name: "Madagascar", flag: "🇲🇬", iso2: "MG", dialCode: "+261" },
  { name: "Malawi", flag: "🇲🇼", iso2: "MW", dialCode: "+265" },
  { name: "Malaysia", flag: "🇲🇾", iso2: "MY", dialCode: "+60" },
  { name: "Maldives", flag: "🇲🇻", iso2: "MV", dialCode: "+960" },
  { name: "Mali", flag: "🇲🇱", iso2: "ML", dialCode: "+223" },
  { name: "Malta", flag: "🇲🇹", iso2: "MT", dialCode: "+356" },
  { name: "Marshall Islands", flag: "🇲🇭", iso2: "MH", dialCode: "+692" },
  { name: "Martinique", flag: "🇲🇶", iso2: "MQ", dialCode: "+596" },
  { name: "Mauritania", flag: "🇲🇷", iso2: "MR", dialCode: "+222" },
  { name: "Mauritius", flag: "🇲🇺", iso2: "MU", dialCode: "+230" },
  { name: "Mayotte", flag: "🇾🇹", iso2: "YT", dialCode: "+262" },
  { name: "Mexico", flag: "🇲🇽", iso2: "MX", dialCode: "+52" },
  { name: "Micronesia, Federated States of Micronesia", flag: "🇫🇲", iso2: "FM", dialCode: "+691" },
  { name: "Moldova", flag: "🇲🇩", iso2: "MD", dialCode: "+373" },
  { name: "Monaco", flag: "🇲🇨", iso2: "MC", dialCode: "+377" },
  { name: "Mongolia", flag: "🇲🇳", iso2: "MN", dialCode: "+976" },
  { name: "Montenegro", flag: "🇲🇪", iso2: "ME", dialCode: "+382" },
  { name: "Montserrat", flag: "🇲🇸", iso2: "MS", dialCode: "+1664" },
  { name: "Morocco", flag: "🇲🇦", iso2: "MA", dialCode: "+212" },
  { name: "Mozambique", flag: "🇲🇿", iso2: "MZ", dialCode: "+258" },
  { name: "Myanmar", flag: "🇲🇲", iso2: "MM", dialCode: "+95" },
  { name: "Namibia", flag: "🇳🇦", iso2: "NA", dialCode: "+264" },
  { name: "Nauru", flag: "🇳🇷", iso2: "NR", dialCode: "+674" },
  { name: "Nepal", flag: "🇳🇵", iso2: "NP", dialCode: "+977" },
  { name: "Netherlands", flag: "🇳🇱", iso2: "NL", dialCode: "+31" },
  { name: "New Caledonia", flag: "🇳🇨", iso2: "NC", dialCode: "+687" },
  { name: "New Zealand", flag: "🇳🇿", iso2: "NZ", dialCode: "+64" },
  { name: "Nicaragua", flag: "🇳🇮", iso2: "NI", dialCode: "+505" },
  { name: "Niger", flag: "🇳🇪", iso2: "NE", dialCode: "+227" },
  { name: "Nigeria", flag: "🇳🇬", iso2: "NG", dialCode: "+234" },
  { name: "Niue", flag: "🇳🇺", iso2: "NU", dialCode: "+683" },
  { name: "Norfolk Island", flag: "🇳🇫", iso2: "NF", dialCode: "+672" },
  { name: "Northern Mariana Islands", flag: "🇲🇵", iso2: "MP", dialCode: "+1670" },
  { name: "Norway", flag: "🇳🇴", iso2: "NO", dialCode: "+47" },
  { name: "Oman", flag: "🇴🇲", iso2: "OM", dialCode: "+968" },
  { name: "Pakistan", flag: "🇵🇰", iso2: "PK", dialCode: "+92" },
  { name: "Palau", flag: "🇵🇼", iso2: "PW", dialCode: "+680" },
  { name: "Palestinian Territory, Occupied", flag: "🇵🇸", iso2: "PS", dialCode: "+970" },
  { name: "Panama", flag: "🇵🇦", iso2: "PA", dialCode: "+507" },
  { name: "Papua New Guinea", flag: "🇵🇬", iso2: "PG", dialCode: "+675" },
  { name: "Paraguay", flag: "🇵🇾", iso2: "PY", dialCode: "+595" },
  { name: "Peru", flag: "🇵🇪", iso2: "PE", dialCode: "+51" },
  { name: "Philippines", flag: "🇵🇭", iso2: "PH", dialCode: "+63" },
  { name: "Pitcairn", flag: "🇵🇳", iso2: "PN", dialCode: "+64" },
  { name: "Poland", flag: "🇵🇱", iso2: "PL", dialCode: "+48" },
  { name: "Portugal", flag: "🇵🇹", iso2: "PT", dialCode: "+351" },
  { name: "Puerto Rico", flag: "🇵🇷", iso2: "PR", dialCode: "+1787" },
  { name: "Qatar", flag: "🇶🇦", iso2: "QA", dialCode: "+974" },
  { name: "Romania", flag: "🇷🇴", iso2: "RO", dialCode: "+40" },
  { name: "Russia", flag: "🇷🇺", iso2: "RU", dialCode: "+7" },
  { name: "Rwanda", flag: "🇷🇼", iso2: "RW", dialCode: "+250" },
  { name: "Reunion", flag: "🇷🇪", iso2: "RE", dialCode: "+262" },
  { name: "Saint Barthelemy", flag: "🇧🇱", iso2: "BL", dialCode: "+590" },
  { name: "Saint Helena, Ascension and Tristan Da Cunha", flag: "🇸🇭", iso2: "SH", dialCode: "+290" },
  { name: "Saint Kitts and Nevis", flag: "🇰🇳", iso2: "KN", dialCode: "+1869" },
  { name: "Saint Lucia", flag: "🇱🇨", iso2: "LC", dialCode: "+1758" },
  { name: "Saint Martin", flag: "🇲🇫", iso2: "MF", dialCode: "+590" },
  { name: "Saint Pierre and Miquelon", flag: "🇵🇲", iso2: "PM", dialCode: "+508" },
  { name: "Saint Vincent and the Grenadines", flag: "🇻🇨", iso2: "VC", dialCode: "+1784" },
  { name: "Samoa", flag: "🇼🇸", iso2: "WS", dialCode: "+685" },
  { name: "San Marino", flag: "🇸🇲", iso2: "SM", dialCode: "+378" },
  { name: "Sao Tome and Principe", flag: "🇸🇹", iso2: "ST", dialCode: "+239" },
  { name: "Saudi Arabia", flag: "🇸🇦", iso2: "SA", dialCode: "+966" },
  { name: "Senegal", flag: "🇸🇳", iso2: "SN", dialCode: "+221" },
  { name: "Serbia", flag: "🇷🇸", iso2: "RS", dialCode: "+381" },
  { name: "Seychelles", flag: "🇸🇨", iso2: "SC", dialCode: "+248" },
  { name: "Sierra Leone", flag: "🇸🇱", iso2: "SL", dialCode: "+232" },
  { name: "Singapore", flag: "🇸🇬", iso2: "SG", dialCode: "+65" },
  { name: "Slovakia", flag: "🇸🇰", iso2: "SK", dialCode: "+421" },
  { name: "Slovenia", flag: "🇸🇮", iso2: "SI", dialCode: "+386" },
  { name: "Solomon Islands", flag: "🇸🇧", iso2: "SB", dialCode: "+677" },
  { name: "Somalia", flag: "🇸🇴", iso2: "SO", dialCode: "+252" },
  { name: "South Africa", flag: "🇿🇦", iso2: "ZA", dialCode: "+27" },
  { name: "South Georgia and the South Sandwich Islands", flag: "🇬🇸", iso2: "GS", dialCode: "+500" },
  { name: "Spain", flag: "🇪🇸", iso2: "ES", dialCode: "+34" },
  { name: "Sri Lanka", flag: "🇱🇰", iso2: "LK", dialCode: "+94" },
  { name: "Sudan", flag: "🇸🇩", iso2: "SD", dialCode: "+249" },
  { name: "Suriname", flag: "🇸🇷", iso2: "SR", dialCode: "+597" },
  { name: "Svalbard and Jan Mayen", flag: "🇸🇯", iso2: "SJ", dialCode: "+47" },
  { name: "Swaziland", flag: "🇸🇿", iso2: "SZ", dialCode: "+268" },
  { name: "Sweden", flag: "🇸🇪", iso2: "SE", dialCode: "+46" },
  { name: "Switzerland", flag: "🇨🇭", iso2: "CH", dialCode: "+41" },
  { name: "Syrian Arab Republic", flag: "🇸🇾", iso2: "SY", dialCode: "+963" },
  { name: "Taiwan", flag: "🇹🇼", iso2: "TW", dialCode: "+886" },
  { name: "Tajikistan", flag: "🇹🇯", iso2: "TJ", dialCode: "+992" },
  { name: "Tanzania, United Republic of Tanzania", flag: "🇹🇿", iso2: "TZ", dialCode: "+255" },
  { name: "Thailand", flag: "🇹🇭", iso2: "TH", dialCode: "+66" },
  { name: "Timor-Leste", flag: "🇹🇱", iso2: "TL", dialCode: "+670" },
  { name: "Togo", flag: "🇹🇬", iso2: "TG", dialCode: "+228" },
  { name: "Tokelau", flag: "🇹🇰", iso2: "TK", dialCode: "+690" },
  { name: "Tonga", flag: "🇹🇴", iso2: "TO", dialCode: "+676" },
  { name: "Trinidad and Tobago", flag: "🇹🇹", iso2: "TT", dialCode: "+1868" },
  { name: "Tunisia", flag: "🇹🇳", iso2: "TN", dialCode: "+216" },
  { name: "Turkey", flag: "🇹🇷", iso2: "TR", dialCode: "+90" },
  { name: "Turkmenistan", flag: "🇹🇲", iso2: "TM", dialCode: "+993" },
  { name: "Turks and Caicos Islands", flag: "🇹🇨", iso2: "TC", dialCode: "+1649" },
  { name: "Tuvalu", flag: "🇹🇻", iso2: "TV", dialCode: "+688" },
  { name: "Uganda", flag: "🇺🇬", iso2: "UG", dialCode: "+256" },
  { name: "Ukraine", flag: "🇺🇦", iso2: "UA", dialCode: "+380" },
  { name: "United Arab Emirates", flag: "🇦🇪", iso2: "AE", dialCode: "+971" },
  { name: "United Kingdom", flag: "🇬🇧", iso2: "GB", dialCode: "+44" },
  { name: "United States", flag: "🇺🇸", iso2: "US", dialCode: "+1" },
  { name: "Uruguay", flag: "🇺🇾", iso2: "UY", dialCode: "+598" },
  { name: "Uzbekistan", flag: "🇺🇿", iso2: "UZ", dialCode: "+998" },
  { name: "Vanuatu", flag: "🇻🇺", iso2: "VU", dialCode: "+678" },
  { name: "Venezuela, Bolivarian Republic of Venezuela", flag: "🇻🇪", iso2: "VE", dialCode: "+58" },
  { name: "Vietnam", flag: "🇻🇳", iso2: "VN", dialCode: "+84" },
  { name: "Virgin Islands, British", flag: "🇻🇬", iso2: "VG", dialCode: "+1284" },
  { name: "Virgin Islands, U.S.", flag: "🇻🇮", iso2: "VI", dialCode: "+1340" },
  { name: "Wallis and Futuna", flag: "🇼🇫", iso2: "WF", dialCode: "+681" },
  { name: "Yemen", flag: "🇾🇪", iso2: "YE", dialCode: "+967" },
  { name: "Zambia", flag: "🇿🇲", iso2: "ZM", dialCode: "+260" },
  { name: "Zimbabwe", flag: "🇿🇼", iso2: "ZW", dialCode: "+263" }
].sort((a, b) => a.name.localeCompare(b.name));  // Sort alphabetically by name

export default function Page() {

    const [loader, setLoader] = useState(false)
    const Router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User.userData) as userData | null
    const cartData = useSelector((state: RootState) => state.Cart.cart) as Data[] | null;
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!Cookies.get('token') || user === null) {
            Router.push('/')
        }
        dispatch(setNavActive('Base'))
    }, [dispatch, Router])

    useEffect(() => {
        fetchCartData();
    }, [])

    const fetchCartData = async () => {
        if (!user?._id) return Router.push('/')
        if (undefined === Cookies.get('token')) {
            Cookies.remove('token');
            localStorage.clear();
            return Router.push('/auth/login?token=expired')
        }
        const cartData = await get_all_cart_Items(user?._id)
        if (cartData?.success) {
            dispatch(setCart(cartData?.data))
        } else {
            if(cartData?.message?.includes('not authorized Please login')){
                Cookies.remove('token');
                localStorage.clear();
                return Router.push('/auth/login?token=expired')
            }
        }
        setLoading(false)
    }

    const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(true)

        const finalData = {
            user : user?._id,
            orderItems : cartData?.map(item => {
                return {
                    product: item?.productID?._id,
                    qty: item?.quantity
                }
            }),
            shippingAddress : {
                fullName: data?.fullName,
                address: data?.address,
                city: data?.city,
                postalCode: data?.postalCode,
                country: data?.country,
            },
            paymentMethod : 'PayPal',
            itemsPrice : totalPrice,
            taxPrice : 0,
            shippingPrice : 5,
            totalPrice : totalPrice + 0 + 5,
            isPaid : true,
            paidAt : new Date(),
            isDelivered : false,
            deliveredAt : new Date(),
        }

        const res =  await create_a_new_order(finalData);
        if(res?.success){
            
            toast.success(res?.message)
            
            setTimeout(() => {
                Router.push('/')
            } , 1000)
            setLoader(false)
        }else{
            setLoader(false)
            throw new Error(res?.message); 
        }
    }

    function calculateTotalPrice(myCart: Data[]) {
        const totalPrice = myCart?.reduce((acc, item) => {
            return acc + (Number(item?.quantity) * Number(item?.productID?.productPrice));
        }, 0);

        return totalPrice;
    }

    const totalPrice = calculateTotalPrice(cartData as Data[])

    return (
        <>
        <div>
          <Navbar />
        </div>
        <div className="w-full h-full bg-white px-2 font-[Poppin]">
            <div className="w-full h-20 my-2 text-center">
                <h1 className="text-2xl py-2 dark:text-black">Votre Commande</h1>
            </div>
            {
                loading || loader ? (
                    <div className="w-full flex-col h-96 flex items-center justify-center">
                        <TailSpin
                            height="50"
                            width="50"
                            color="orange"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                        <p className="text-sm mt-2 font-semibold text-orange-500">Chargement en cours....</p>
                    </div>
                ) : (

                    <div className="h-full flex-col md:flex-row flex items-start justify-center">

                        <div className="md:w-2/3 px-2 h-full flex-col items-end justify-end flex">
                            <div className="overflow-y-auto overflow-x-hidden w-full flex flex-col items-center py-2 overflow-auto h-96">
                                {
                                    cartData?.length === 0 ?
                                        <div className="w-full h-full flex items-center justify-center flex-col">
                                            <p className="my-4 mx-2 text-lg font-semibold">Aucun produit dans le panier</p>
                                            <Link href={"/"} className="btn text-white">Retour</Link>
                                        </div>
                                        :
                                        cartData?.map((item: Data) => {
                                            return <CartCard key={item?._id}
                                                productID={item?.productID}
                                                userID={item?.userID}
                                                _id={item?._id}
                                                quantity={item?.quantity}
                                                isOverlay={false}
                                            />
                                        })
                                }
                            </div>
                            <div className="w-full  py-2 my-2 flex justify-end">
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Original Price  <span className="text-xl font-extrabold">&euro; {totalPrice || 0}</span> </h1>
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Shipping Price  <span className="text-xl font-extrabold">&euro; {5}</span> </h1>
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  tax Price  <span className="text-xl font-extrabold">&euro; {0}</span> </h1>
                            </div>
                            <div className="w-full py-2 my-2 flex justify-end">
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Total Order Price  <span className="text-xl font-extrabold">&euro; {totalPrice + 5}</span> </h1>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/3 px-2 w-full max-w-lg py-2 flex-col">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label >
                                <input {...register("fullName", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.fullName && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div >
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Your Address</span>
                                </label>
                                <input  {...register("address", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.address && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">City</span>
                                </label>
                                <input  {...register("city", { required: true })} type="text" className="file-input file-input-bordered w-full " />
                                {errors.city && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text">Postal Code</span>
                                </label>
                                <input  {...register("postalCode", { required: true })} type="number" className="file-input file-input-bordered w-full " />
                                {errors.postalCode &&  <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text">Country</span>
                                </label>
                                <select {...register("country", { required: true })} className="select select-bordered w-full ">
                                    <option value="">Select a country</option>
                                    {countries.map((country) => (
                                    <option key={country.iso2} value={country.iso2}>
                                        {country.flag} {country.name}
                                    </option>
                                    ))}
                                </select>
                                {errors.country && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>

                            <button className="btn btn-block mt-3">Order !</button>

                        </form >

                    </div >


                )
            }

        </div><ToastContainer/>
        </>
    )
}
