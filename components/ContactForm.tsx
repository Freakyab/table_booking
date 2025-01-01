import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormData } from '../types'

interface ContactFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactForm = ({ formData, onChange }: ContactFormProps) => (
  <div className="space-y-4 border-t pt-6">
    <h3 className="text-lg font-semibold">Contact Details</h3>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          placeholder="Enter your first name"
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          placeholder="Enter your last name"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          placeholder="Enter your phone number"
          required
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Input
          id="specialRequests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={onChange}
          placeholder="Any special requests or notes"
        />
      </div>
    </div>
  </div>
);