import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

const fieldIcons = {
  userName: User,
  userEmail: Mail,
  password: Lock,
};

function FormControls({ formControls = [], formData, setFormData }) {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  function toggleVisibility(name) {
    setVisiblePasswords((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const FieldIcon = fieldIcons[getControlItem.name];
    const isPassword = getControlItem.type === "password";
    const isPasswordVisible = visiblePasswords[getControlItem.name];

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="relative">
            {FieldIcon ? (
              <FieldIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            ) : null}
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={isPassword && isPasswordVisible ? "text" : getControlItem.type}
              value={currentControlItemValue}
              className={`${FieldIcon ? "pl-9" : ""} ${isPassword ? "pr-9" : ""}`}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
            {isPassword ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => toggleVisibility(getControlItem.name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            ) : null}
          </div>
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((controleItem) => (
        <div key={controleItem.name}>
          <Label htmlFor={controleItem.name}>{controleItem.label}</Label>
          {renderComponentByType(controleItem)}
        </div>
      ))}
    </div>
  );
}

export default FormControls;
