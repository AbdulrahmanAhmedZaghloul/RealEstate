import React, { useEffect } from "react";
import {
      Modal,
      TextInput,
      NumberInput,
      Select,
      Button,
      Group,
      Stack,
      GridCol,
      Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "../../../context/LanguageContext";
import { useCreateClientRequest } from "../../../hooks/queries/Requests/useCreateClientRequest";
import LocationPicker from "../AddProperty/LocationPicker";
// دالة مساعدة لتنسيق رقم الهاتف
const formatAndSetPhone = (digits, form) => {
      if (digits.length < 3) {
            form.setFieldValue("client_phone", "+966 ");
            return;
      }

      let formattedNumber = "+966";

      const phoneDigits = digits.slice(3, 12); // نأخذ 9 أرقام بعد 966

      if (phoneDigits.length > 0) {
            formattedNumber += " " + phoneDigits.slice(0, 2); // أول جزئيتين
      }
      if (phoneDigits.length > 2) {
            formattedNumber += " " + phoneDigits.slice(2, 5); // الجزء التالي
      }
      if (phoneDigits.length > 5) {
            formattedNumber += " " + phoneDigits.slice(5, 9); // الجزء الأخير
      }

      form.setFieldValue("client_phone", formattedNumber);
};
export function AddClientRequestModal({ opened, onClose, defaultValues }) {
      const { t } = useTranslation();
      const { mutate, isLoading, isSuccess, isError, error } = useCreateClientRequest();

      const form = useForm({
            initialValues: {
                  client_name: defaultValues?.client_name ?? "",
                  client_phone: defaultValues?.client_phone ?? "",
                  location: defaultValues?.location ?? "",
                  region_id: defaultValues?.region_id ?? "",
                  city_id: defaultValues?.city_id ?? "",
                  district_id: defaultValues?.district_id ?? "",
                  property_type: defaultValues?.property_type ?? "rent",
                  price_min: defaultValues?.price_min ?? "",
                  price_max: defaultValues?.price_max ?? "",
                  area_min: defaultValues?.area_min ?? "",
                  area_max: defaultValues?.area_max ?? "",
            },
            validate: {
                  client_name: (value) => (!value ? t.Required ?? "Required" : null),
                  client_phone: (value) => {
                        if (!value) return t.Required ?? "Required";

                        // إزالة كل شيء غير الأرقام
                        const digitsOnly = value.replace(/\D/g, "");

                        // التحقق من أن الرقم يبدأ بـ 966 ويتبعه 9 أرقام
                        const saudiPhoneRegex = /^9665\d{8}$/;

                        if (!saudiPhoneRegex.test(digitsOnly)) {
                              return t.InvalidSaudiPhone ?? "Invalid Saudi phone number";
                        }
                        return null;
                  },
                  location: (value) => (!value ? t.Required ?? "Required" : null),
                  property_type: (value) => (!value ? t.Required ?? "Required" : null),
                  price_min: (value) =>
                        value === "" || value == null
                              ? t.Required ?? "Required"
                              : isNaN(value) || Number(value) < 0
                                    ? t.InvalidNumber ?? "Invalid number"
                                    : null,
                  price_max: (value) =>
                        value === "" || value == null
                              ? t.Required ?? "Required"
                              : isNaN(value) || Number(value) < 0
                                    ? t.InvalidNumber ?? "Invalid number"
                                    : null,
                  area_min: (value) =>
                        value === "" || value == null
                              ? t.Required ?? "Required"
                              : isNaN(value) || Number(value) < 0
                                    ? t.InvalidNumber ?? "Invalid number"
                                    : null,
                  area_max: (value) =>
                        value === "" || value == null
                              ? t.Required ?? "Required"
                              : isNaN(value) || Number(value) < 0
                                    ? t.InvalidNumber ?? "Invalid number"
                                    : null,
            },
      });

      // تحقق من أن Min <= Max
      const validateMinMax = () => {
            const { price_min, price_max, area_min, area_max } = form.values;

            if (
                  price_min !== "" &&
                  price_max !== "" &&
                  Number(price_min) > Number(price_max)
            ) {
                  form.setFieldError("price_min", t.PriceMinGreaterThanMax ?? "Min price cannot be greater than max price");
                  return false;
            }

            if (
                  area_min !== "" &&
                  area_max !== "" &&
                  Number(area_min) > Number(area_max)
            ) {
                  form.setFieldError("area_min", t.AreaMinGreaterThanMax ?? "Min area cannot be greater than max area");
                  return false;
            }

            return true;
      };

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
                  const serverMsg = error?.response?.data?.message || error?.message;
                  notifications.show({
                        title: t.Error ?? "Error",
                        message: serverMsg ?? t.SomethingWentWrong ?? "Something went wrong.",
                        color: "red",
                  });
            }
      }, [isError]);

      const handleSubmit = (values) => {
            if (!validateMinMax()) return;

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
            <Modal
                  opened={opened}
                  onClose={onClose}
                  title={t.AddClientRequest ?? "Add Client Request"}
                  centered
                  size="lg"
            >
                  <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                              <Grid>
                                    <GridCol span={{ base: 12, lg: 6, md: 6, sm: 6 }}>
                                          <TextInput
                                                label={t.ClientName ?? "Client name"}
                                                placeholder="Ahmed Salem"
                                                withAsterisk
                                                {...form.getInputProps("client_name")}
                                          />

                                      
                                    </GridCol>
                                    <GridCol span={{ base: 12, lg: 6, md: 6, sm: 6 }}>
                                        

                                          <TextInput
                                                label={t.ClientPhone ?? "Phone"}
                                                placeholder="51 234 5678"
                                                value={form.values.client_phone}
                                                onChange={(e) => {
                                                      let input = e.target.value;

                                                      // إزالة كل شيء غير أرقام
                                                      const digitsOnly = input.replace(/\D/g, "");

                                                      // إذا لم يبدأ برقم 966، نتأكد من إضافته
                                                      if (!digitsOnly.startsWith("966") && digitsOnly.length > 0) {
                                                            // إذا كتب المستخدم أرقام بدون 966، نضيفها تلقائيًا
                                                            if (digitsOnly.startsWith("5") && digitsOnly.length <= 9) {
                                                                  const cleaned = "966" + digitsOnly;
                                                                  formatAndSetPhone(cleaned, form);
                                                                  return;
                                                            } else if (digitsOnly.startsWith("05") && digitsOnly.length <= 10) {
                                                                  const cleaned = "966" + digitsOnly.slice(1);
                                                                  formatAndSetPhone(cleaned, form);
                                                                  return;
                                                            } else {
                                                                  // في حالة أرقام عشوائية، نبدأ بـ 966
                                                                  const cleaned = "966" + digitsOnly.slice(0, 9);
                                                                  formatAndSetPhone(cleaned, form);
                                                                  return;
                                                            }
                                                      }

                                                      // إذا كان يبدأ بـ 966، نكمل التنسيق
                                                      if (digitsOnly.startsWith("966")) {
                                                            formatAndSetPhone(digitsOnly, form);
                                                            return;
                                                      }

                                                      // إذا كان فارغًا أو أقل من 3 أرقام
                                                      if (digitsOnly.length === 0) {
                                                            form.setFieldValue("client_phone", "");
                                                            return;
                                                      }
                                                }}
                                                onFocus={(e) => {
                                                      // عند التركيز، إذا كان الحقل فارغًا نضع +966
                                                      if (!form.values.client_phone || form.values.client_phone === "") {
                                                            form.setFieldValue("client_phone", "+966 ");
                                                      }
                                                      // وضع المؤشر في نهاية النص
                                                      setTimeout(() => {
                                                            e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                                                      }, 0);
                                                }}
                                                leftSection={
                                                      <img
                                                            src="https://flagcdn.com/w20/sa.png"
                                                            alt="Saudi Arabia"
                                                            width={20}
                                                            height={20}
                                                      />
                                                }
                                                leftSectionPointerEvents="none"
                                                styles={{
                                                      width : "100%",
                                                      // input: { width: "100%" },
                                                      // wrapper: { width: 289 }
                                                }}
                                                error={form.errors.client_phone}
                                          />
                                    </GridCol>
                              </Grid>


                              <LocationPicker
                                    value={{
                                          region_id: form.values.region_id,
                                          city_id: form.values.city_id,
                                          district_id: form.values.district_id,
                                    }}
                                    onChange={(data) => {
                                          form.setFieldValue("location", data.location);
                                          form.setFieldValue("region_id", data.region_id);
                                          form.setFieldValue("city_id", data.city_id);
                                          form.setFieldValue("district_id", data.district_id);
                                    }}
                                    error={form.errors.location}
                              />

                              <Select
                                    label={t.PropertyType ?? "Property type"}
                                    withAsterisk
                                    data={[
                                          { value: "rent", label: t.Rent ?? "Rent" },
                                          { value: "sale", label: t.Sale ?? "Sale" },
                                          { value: "boooking", label: t.boooking ?? "Booking" },
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