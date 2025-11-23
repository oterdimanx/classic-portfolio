import React, { useState } from 'react';

interface ContactFormData {
  contactFullName: string;
  contactEmail: string;
  contactType: 'question' | 'remark' | 'support' | 'other';
  contactDescription: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    contactFullName: '',
    contactEmail: '',
    contactType: 'question',
    contactDescription: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const buttonStyles = {
    primary: "btn w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to your backend
      const response = await fetch('/api/common/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Call the onSubmit prop if provided
        onSubmit?.(formData);
        // Reset form
        setFormData({
          contactFullName: '',
          contactEmail: '',
          contactType: 'question',
          contactDescription: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-8 mt-5 mb-5 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
          ✓
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Merci de nous avoir contacté</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Nous avons bien reçu votre message. Nous vous répondrons aussi rapidement que possible. Merci pour votre intérêt !
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className={buttonStyles.primary}
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-2xl mx-auto mt-5 mb-5 bg-white rounded-xl shadow-sm border border-gray-100 p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Contactez-nous</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Nous sommes à votre disposition pour répondre à vos questions ou prendre contact. 
          Envoyez nous un message et nous répondrons aussi rapidement que possible.
        </p>
      </div>

      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label htmlFor="contactFullName" className="block text-sm font-medium text-gray-700">
            Nom Complet *
          </label>
          <input
            type="text"
            id="contactFullName"
            name="contactFullName"
            value={formData.contactFullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
            Adresse Email *
          </label>
          <input
            type="contactEmail"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      {/* Contact Type Field */}
      <div className="space-y-2 mb-6">
        <label htmlFor="contactType" className="block text-sm font-medium text-gray-700">
          Type de Demande *
        </label>
        <select
          id="contactType"
          name="contactType"
          value={formData.contactType}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22><path%20fill=%22%236b7280%22%20fill-rule=%22evenodd%22%20d=%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule=%22evenodd%22/></svg>')] bg-no-repeat bg-right-2.5 bg-center bg-[length:1.5em_1.5em] pr-10"
        >
          <option value="question">Question d'ordre générale</option>
          <option value="remark">Remarques / Retours concernant un produit en particulier</option>
          <option value="support">Support Technique</option>
          <option value="other">Autre</option>
        </select>
      </div>

      {/* Message Field */}
      <div className="space-y-2 mb-8">
        <label htmlFor="contactDescription" className="block text-sm font-medium text-gray-700">
          Message *
        </label>
        <textarea
          id="contactDescription"
          name="contactDescription"
          value={formData.contactDescription}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 resize-vertical min-h-[120px]"
          placeholder="Please describe your inquiry in detail..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonStyles.primary}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Envoi...
          </span>
        ) : (
          'Envoyer le Message'
        )}
      </button>
    </form>
  );
};

export default ContactForm;