"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type FieldDefinition = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "boolean" | "textarea";
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: any;
};

interface FormBuilderProps {
  fields: FieldDefinition[];
  onSubmit: (data: any) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function FormBuilder({ 
  fields, 
  onSubmit, 
  submitLabel = "Save Changes",
  isSubmitting = false 
}: FormBuilderProps) {
  // Generate Zod schema dynamically
  const schemaShape: any = {};
  fields.forEach(field => {
    let validator: any = z.any();
    
    if (field.type === "text" || field.type === "textarea" || field.type === "select") {
      validator = z.string();
      if (field.required) validator = validator.min(1, `${field.label} is required`);
      else validator = validator.optional();
    } else if (field.type === "number") {
      validator = z.coerce.number();
      if (field.required) validator = validator.min(0, `${field.label} must be positive`);
    } else if (field.type === "boolean") {
      validator = z.boolean();
    }
    
    schemaShape[field.name] = validator;
  });

  const formSchema = z.object(schemaShape);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue ?? (field.type === "boolean" ? false : ""),
    }), {}),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                   <div className="flex items-center justify-between">
                     <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">{field.label}</FormLabel>
                     {field.required && <span className="text-[10px] font-bold text-rose-500 uppercase">Required</span>}
                   </div>
                  
                  <FormControl>
                    {field.type === "text" ? (
                      <Input 
                        placeholder={field.placeholder} 
                        {...formField} 
                        className="h-12 rounded-xl border-slate-200 bg-white font-medium shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    ) : field.type === "number" ? (
                      <Input 
                        type="number" 
                        placeholder={field.placeholder} 
                        {...formField} 
                        className="h-12 rounded-xl border-slate-200 bg-white font-medium shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    ) : field.type === "textarea" ? (
                      <Textarea 
                        placeholder={field.placeholder} 
                        {...formField} 
                        rows={5}
                        className="rounded-xl border-slate-200 bg-white font-medium shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    ) : field.type === "select" ? (
                      <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-medium shadow-sm">
                            <SelectValue placeholder={field.placeholder || "Select an option"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-1">
                          {field.options?.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="rounded-lg font-medium px-4 py-3">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                        <Checkbox
                          id={field.name}
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label htmlFor={field.name} className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                           Enable this feature
                        </label>
                      </div>
                    )}
                  </FormControl>
                  
                  {field.description && (
                    <FormDescription className="text-xs font-semibold text-slate-400">
                      {field.description}
                    </FormDescription>
                  )}
                  <FormMessage className="text-xs font-bold text-rose-500" />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
           <Button variant="ghost" type="button" className="h-12 font-bold text-slate-500 hover:bg-slate-50 rounded-xl px-6">
              Cancel Operations
           </Button>
           <Button 
             type="submit" 
             disabled={isSubmitting} 
             className="h-12 bg-slate-900 text-white font-bold rounded-xl px-10 shadow-xl shadow-slate-900/10 hover:translate-y-[-1px] active:scale-95 transition-all"
           >
             {isSubmitting ? "Validating Engine..." : submitLabel}
           </Button>
        </div>
      </form>
    </Form>
  );
}
