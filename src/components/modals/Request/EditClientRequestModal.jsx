// src/components/modals/Request/EditClientRequestModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Group,
  Button,
  Text,
  ActionIcon, // ✅ أضف ActionIcon
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";
import { useQueryClient } from "@tanstack/react-query";
import LocationPicker from "../../../components/modals/AddProperty/LocationPicker";
import EditIcon from "../../icons/edit"; // ✅ تأكد من مسار الأيقونة

export function EditClientRequestModal({ opened, onClose, request }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    location: "",
    region_id: "",
    city_id: "",
    district_id: "",
    property_type: "rent",
    price_min: "",
    price_max: "",
    area_min: "",
    area_max: "",
  });

  // ✅ حالة جديدة للتحكم في عرض LocationPicker
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    if (opened && request) {
      setFormData({
        client_name: request.client_name || "",
        client_phone: request.client_phone || "",
        location: request.location || "",
        region_id: request.region_id || "",
        city_id: request.city_id || "",
        district_id: request.district_id || "",
        property_type: request.property_type || "rent",
        price_min: request.price_min ? parseFloat(request.price_min) : "",
        price_max: request.price_max ? parseFloat(request.price_max) : "",
        area_min: request.area_min ? parseFloat(request.area_min) : "",
        area_max: request.area_max ? parseFloat(request.area_max) : "",
      });
      setErrors({});
      // ✅ أعد تعيين حالة التحرير عند فتح المودال أو تغيير الطلب
      setIsEditingLocation(false);
    }
  }, [opened, request]);

  const validate = () => {
    const newErrors = {};
    if (!formData.client_name || formData.client_name.length < 2) {
      newErrors.client_name = "Name must be at least 2 characters.";
    }
    // التحقق من رقم سعودي بصيغة +9665XXXXXXXX
    const saudiPhoneRegex = /^\+9665\d{8}$/;
    const cleanedPhone = formData.client_phone.replace(/\s/g, ""); // إزالة المسافات
    if (!formData.client_phone) {
      newErrors.client_phone = "Phone is required.";
    } else if (!saudiPhoneRegex.test(cleanedPhone)) {
      newErrors.client_phone = "Phone must be Saudi format (+9665XXXXXXXX).";
    }
    // ✅ تحقق من صحة الموقع إذا كان المستخدم بيشتغل عليه
    if (isEditingLocation && (!formData.region_id || !formData.city_id || !formData.district_id)) {
      newErrors.location = "Please select a valid location.";
    }
    if (formData.price_min && formData.price_max && formData.price_min > formData.price_max) {
      newErrors.price = "Min price cannot be greater than Max price.";
    }
    if (formData.area_min && formData.area_max && formData.area_min > formData.area_max) {
      newErrors.area = "Min area cannot be greater than Max area.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // دالة الحفظ
  const handleSubmit = async () => {
    // ✅ استخدم دالة التحقق المحدثة
    if (!request?.id || !validate()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.put(`crm/${request?.id}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      queryClient.invalidateQueries(["client-requests"]);
      queryClient.invalidateQueries(["TableClientRequests"]);
      queryClient.invalidateQueries(["RequestsKPIs"]);
      notifications.show({
        title: "Success",
        message: response.data.message || "Request updated successfully.",
        color: "green",
      });
      onClose(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Failed to update request.";
      notifications.show({ title: "Error", message, color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => onClose(false)}
      title="Edit Client Request"
      centered
      size="lg"
      radius="lg"
      overlayProps={{ opacity: 0.55, blur: 3 }}
    >
      <Stack gap="md">
        <TextInput
          label="Client Name"
          placeholder="Enter client name"
          value={formData.client_name}
          onChange={(e) =>
            setFormData({ ...formData, client_name: e.currentTarget.value })
          }
          error={errors.client_name}
          required
        />
        <TextInput
          label="Phone"
          placeholder="5XX XXX XXX"
          value={formData.client_phone}
          onChange={(e) => {
            let input = e.target.value;
            // إزالة كل شيء غير أرقام
            const digitsOnly = input.replace(/\D/g, "");
            // إذا لم يبدأ بـ +966، نضيفه
            if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
              const cleaned = "+966" + digitsOnly.slice(3, 12);
              setFormData({ ...formData, client_phone: cleaned });
              return;
            }
            // لو أقل من 3 أرقام، نعيده إلى +966
            if (digitsOnly.length < 3) {
              setFormData({ ...formData, client_phone: "+966" });
              return;
            }
            // تنسيق الرقم بمسافات
            let formattedNumber = "+966";
            const phoneDigits = digitsOnly.slice(3); // الأرقام بعد +966
            if (phoneDigits.length > 0) formattedNumber += " " + phoneDigits.slice(0, 3);
            if (phoneDigits.length > 3) formattedNumber += " " + phoneDigits.slice(3, 6);
            if (phoneDigits.length > 6) formattedNumber += " " + phoneDigits.slice(6, 9);
            setFormData({ ...formData, client_phone: formattedNumber });
          }}
          onFocus={() => {
            if (!formData.client_phone || !formData.client_phone.startsWith("+966")) {
              setFormData({ ...formData, client_phone: "+966" });
            }
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
          styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
          error={errors.client_phone}
          required
        />

        {/* ✅ قسم الموقع الجديد */}
        <div>
          <Text size="sm" fw={500} mb={5}> {/* Label for Location */}
            Location
            {isEditingLocation && <span className="mantine-InputWrapper-required" aria-hidden="true"> *</span>} {/* Optional asterisk if required while editing */}
          </Text>
          {isEditingLocation ? (
            // ✅ عرض LocationPicker إذا كان المستخدم بيشتغل على الموقع
            <>
              <LocationPicker
                value={{
                  region_id: formData.region_id,
                  city_id: formData.city_id,
                  district_id: formData.district_id,
                }}
                onChange={(val) => {
                  // ✅ تحديث formData عند اختيار موقع جديد
                  setFormData({
                    ...formData,
                    location: val.location,
                    region_id: val.region_id,
                    city_id: val.city_id,
                    district_id: val.district_id,
                  });
                  // يمكنك إضافة setErrors({ location: null }) هنا إذا كان هناك خطأ سابق
                }}
                error={errors.location}
              // required={isEditingLocation} // يمكنك تفعيل هذا إذا أردت جعله إجباريًا فقط أثناء التحرير
              />
              <Group justify="flex-end" mt="xs">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    // ✅ إلغاء التحرير وإعادة تعيين الموقع إلى القيم الأصلية من الطلب
                    setIsEditingLocation(false);
                    if (request) {
                      setFormData(prev => ({
                        ...prev,
                        location: request.location || "",
                        region_id: request.region_id || "",
                        city_id: request.city_id || "",
                        district_id: request.district_id || "",
                      }));
                      // يمكنك أيضًا إزالة خطأ الموقع إذا كان موجودًا
                      setErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors.location;
                        return newErrors;
                      });
                    }
                  }}
                >
                  Cancel Edit Location
                </Button>
              </Group>
            </>
          ) : (
            // ✅ عرض حقل نصي فقط إذا لم يكن المستخدم بيشتغل على الموقع
            <Group align="center" grow> {/* Group to keep items aligned */}
              <TextInput
                value={formData.location || "No location selected"} // عرض اسم الموقع أو رسالة
                readOnly // جعل الحقل للقراءة فقط
                disabled // أو استخدم disabled بدلاً من readOnly حسب التصميم المطلوب
                error={errors.location} // عرض الخطأ إن وجد (رغم أنه نادر في هذه الحالة)
                styles={{ input: { cursor: 'default' } }} // تغيير مؤشر الماوس
              />
              <ActionIcon
                onClick={() => setIsEditingLocation(true)} // ✅ تشغيل وضع تحرير الموقع
                variant="light"
                color="blue" // يمكنك تغيير اللون
                title="Edit Location" // نص مساعدة
              >
                <EditIcon size={16} />
              </ActionIcon>
            </Group>
          )}
        </div>
        {/* ✅ نهاية قسم الموقع الجديد */}

        <Select
          label="Property Type"
          data={[
            { value: "buy", label: "Buy" },
            { value: "rent", label: "Rent" },
            { value: "booking", label: "Booking" },
          ]}
          value={formData.property_type}
          onChange={(value) =>
            setFormData({ ...formData, property_type: value })
          }
          required
        />
        <Group grow>
          <NumberInput
            label="Min Price"
            placeholder="Min"
            value={formData.price_min}
            onChange={(value) => setFormData({ ...formData, price_min: value })}
            min={1}
            hideControls
            error={errors.price}
          />
          <NumberInput
            label="Max Price"
            placeholder="Max"
            value={formData.price_max}
            onChange={(value) => setFormData({ ...formData, price_max: value })}
            min={1}
            hideControls
          />
        </Group>
        <Group grow>
          <NumberInput
            label="Min Area (m²)"
            placeholder="Min area"
            value={formData.area_min}
            onChange={(value) => setFormData({ ...formData, area_min: value })}
            min={1}
            hideControls
            error={errors.area}
          />
          <NumberInput
            label="Max Area (m²)"
            placeholder="Max area"
            value={formData.area_max}
            onChange={(value) => setFormData({ ...formData, area_max: value })}
            min={1}
            hideControls
          />
        </Group>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Update Request
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

