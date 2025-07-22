// =============================================================
// 2) Component: AddClientRequestModal
// =============================================================
// Modal يحتوي على حقول الإدخال وإرسال الطلب.

// File: src/components/Requests/AddClientRequestModal.jsx
import React, { useEffect } from "react";
import {
      Modal,
      TextInput,
      NumberInput,
      Select,
      Button,
      Group,
      Stack,
      Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
// import { useTranslation } from "../../context/LanguageContext";
// import { useCreateClientRequest } from "../../hooks/queries/Requests/useCreateClientRequest";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "../../../context/LanguageContext";
import { useCreateClientRequest } from "../../../hooks/queries/Requests/useCreateClientRequest";

export function AddClientRequestModal({ opened, onClose, defaultValues }) {
      const { t } = useTranslation();
      const { mutate, isLoading, isSuccess, isError, error, data } = useCreateClientRequest();

      const form = useForm({
            initialValues: {
                  client_name: defaultValues?.client_name ?? "",
                  client_phone: defaultValues?.client_phone ?? "",
                  location: defaultValues?.location ?? "",
                  property_type: defaultValues?.property_type ?? "rent", // rent | sale | other?
                  price_min: defaultValues?.price_min ?? "",
                  price_max: defaultValues?.price_max ?? "",
                  area_min: defaultValues?.area_min ?? "",
                  area_max: defaultValues?.area_max ?? "",
            },
            validate: {
                  client_name: (v) => (!!v ? null : t.Required ?? "Required"),
                  client_phone: (v) => (!!v ? null : t.Required ?? "Required"),
                  location: (v) => (!!v ? null : t.Required ?? "Required"),
                  property_type: (v) => (!!v ? null : t.Required ?? "Required"),
                  price_min: (v) => (v === "" || v == null ? t.Required ?? "Required" : null),
                  price_max: (v) => (v === "" || v == null ? t.Required ?? "Required" : null),
                  area_min: (v) => (v === "" || v == null ? t.Required ?? "Required" : null),
                  area_max: (v) => (v === "" || v == null ? t.Required ?? "Required" : null),
            },
      });

      // إشعار عند النجاح / الخطأ
      useEffect(() => {
            if (isSuccess) {
                  notifications.show({
                        title: t.Success ?? "Success",
                        message: t.ClientRequestCreated ?? "Client request created successfully.",
                        color: "green",
                  });
                  onClose?.();
            }
      }, [isSuccess]);

      useEffect(() => {
            if (isError) {
                  // حاول استخراج رسالة من السيرفر
                  const serverMsg = error?.response?.data?.message || error?.message;
                  notifications.show({
                        title: t.Error ?? "Error",
                        message: serverMsg ?? t.SomethingWentWrong ?? "Something went wrong.",
                        color: "red",
                  });
            }
      }, [isError]);

      const handleSubmit = (values) => {
            // تحويل القيم الرقمية (Mantine TextInput/NumberInput قد تعيد string)
            const payload = {
                  ...values,
                  price_min: values.price_min !== "" ? Number(values.price_min) : null,
                  price_max: values.price_max !== "" ? Number(values.price_max) : null,
                  area_min: values.area_min !== "" ? Number(values.area_min) : null,
                  area_max: values.area_max !== "" ? Number(values.area_max) : null,
            };
            mutate(payload);
      };

      return (
            <Modal opened={opened} onClose={onClose} title={t.AddClientRequest ?? "Add Client Request"} centered size="lg">
                  <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                              <TextInput
                                    label={t.ClientName ?? "Client name"}
                                    placeholder="Ahmed Salem"
                                    withAsterisk
                                    {...form.getInputProps("client_name")}
                              />

                              <TextInput
                                    label={t.ClientPhone ?? "Phone"}
                                    placeholder="01000000000"
                                    withAsterisk
                                    {...form.getInputProps("client_phone")}
                              />

                              <TextInput
                                    label={t.Location ?? "Location"}
                                    placeholder="Cairo, ..."
                                    withAsterisk
                                    {...form.getInputProps("location")}
                              />

                              <Select
                                    label={t.PropertyType ?? "Property type"}
                                    withAsterisk
                                    data={[
                                          { value: "rent", label: t.Rent ?? "Rent" },
                                          { value: "sale", label: t.Sale ?? "Sale" },
                                          { value: "boooking", label: t.boooking ?? "boooking" },
                                    ]}
                                    {...form.getInputProps("property_type")}
                              />

                              <Group grow>
                                    <NumberInput
                                          label={t.PriceMin ?? "Min price"}
                                          placeholder="1500000"
                                          min={0}
                                          thousandSeparator
                                          withAsterisk
                                          {...form.getInputProps("price_min")}
                                    />
                                    <NumberInput
                                          label={t.PriceMax ?? "Max price"}
                                          placeholder="900000000"
                                          min={0}
                                          thousandSeparator
                                          withAsterisk
                                          {...form.getInputProps("price_max")}
                                    />
                              </Group>

                              <Group grow>
                                    <NumberInput
                                          label={t.AreaMin ?? "Min area (m²)"}
                                          placeholder="900"
                                          min={0}
                                          withAsterisk
                                          {...form.getInputProps("area_min")}
                                    />
                                    <NumberInput
                                          label={t.AreaMax ?? "Max area (m²)"}
                                          placeholder="2000"
                                          min={0}
                                          withAsterisk
                                          {...form.getInputProps("area_max")}
                                    />
                              </Group>

                              <Group justify="flex-end" mt="md">
                                    <Button variant="default" onClick={onClose} disabled={isLoading}>
                                          {t.Cancel ?? "Cancel"}
                                    </Button>
                                    <Button type="submit" loading={isLoading}>
                                          {t.Save ?? "Save"}
                                    </Button>
                              </Group>
                        </Stack>
                  </form>
            </Modal>
      );
}
