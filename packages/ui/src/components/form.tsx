"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Label as LabelPrimitive } from "./label";
import { cn } from "@/lib/utils";

const Root = FormProvider;

const FieldContext = React.createContext<{ name: FieldPath<FieldValues> }>(
    {} as { name: FieldPath<FieldValues> },
);

const Field = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
      ...props
  }: ControllerProps<TFieldValues, TName>) => (
    <FieldContext.Provider value={{ name: props.name }}>
        <Controller {...props} />
    </FieldContext.Provider>
);

const ItemContext = React.createContext<{ id: string }>(
    {} as { id: string },
);

const Item = ({ className, ...props }: React.ComponentProps<"div">) => {
    const id = React.useId();

    return (
        <ItemContext.Provider value={{ id }}>
            <div
                data-slot="form-item"
                className={cn("grid gap-2", className)}
                {...props}
            />
        </ItemContext.Provider>
    );
};

export const useFormField = () => {
    const fieldContext = React.useContext(FieldContext);
    const itemContext = React.useContext(ItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <Form.Field>");
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

const Label = ({
                   className,
                   ...props
               }: React.ComponentProps<typeof LabelPrimitive>) => {
    const { error, formItemId } = useFormField();

    return (
        <LabelPrimitive
            data-slot="form-label"
            data-error={!!error}
            className={cn("data-[error=true]:text-destructive", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
};

const Control = ({ ...props }: React.ComponentProps<typeof Slot.Root>) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
        <Slot.Root
            data-slot="form-control"
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
};

const Description = ({ className, ...props }: React.ComponentProps<"p">) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            data-slot="form-description"
            id={formDescriptionId}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
};

const Message = ({ className, ...props }: React.ComponentProps<"p">) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? "") : props.children;

    if (!body) {
        return null;
    }

    return (
        <p
            data-slot="form-message"
            id={formMessageId}
            className={cn("text-sm text-destructive", className)}
            {...props}
        >
            {body}
        </p>
    );
};

export const Form = Object.assign(Root, {
    Field,
    Item,
    Label,
    Control,
    Description,
    Message,
});