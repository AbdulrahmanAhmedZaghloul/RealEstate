import { useEffect, useState } from 'react';
import { Grid, TextInput, ActionIcon, Button, Group } from "@mantine/core";
import EditIcon from "../../../components/icons/edit";
import classes from "../../../styles/ClientRequestsDetails.module.css";

function validateSaudiPhoneNumber(phoneNumber) {
      const cleaned = phoneNumber.replace(/\D/g, "");
      const regex = /^9665\d{8}$/; // يبدأ بـ 9665 ويتبعها 8 أرقام
      return regex.test(cleaned);
}

const ClientInfoSection = ({
      client_request,
      editClientInfo,
      setEditClientInfo,
      formData,
      setFormData,
      startEditClientInfo,
      handleSaveClientInfo
}) => {
      const [phoneError, setPhoneError] = useState(null);

      // التنسيق والتحقق من الرقم أثناء الكتابة
      const handlePhoneChange = (e) => {
            let input = e.target.value;
            const digitsOnly = input.replace(/\D/g, "");

            // إذا لم يبدأ بـ 966 نضيفها
            if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
                  input = "+966" + digitsOnly.slice(3);
            } else if (digitsOnly.length < 3) {
                  input = "+966";
            } else {
                  input = "+966" + digitsOnly.slice(3);
            }

            // تنسيق بالمسافات
            const phoneDigits = input.replace(/\D/g, "").slice(3); // بعد 966
            let formatted = "+966";
            if (phoneDigits.length > 0) formatted += " " + phoneDigits.slice(0, 3);
            if (phoneDigits.length > 3) formatted += " " + phoneDigits.slice(3, 6);
            if (phoneDigits.length > 6) formatted += " " + phoneDigits.slice(6, 9);

            setFormData({ ...formData, client_phone: formatted });
            setPhoneError(null); // reset error on change
      };

      const handleSave = () => {
            const isValid = validateSaudiPhoneNumber(formData.client_phone);
            if (!isValid) {
                  setPhoneError("رقم الهاتف غير صالح، يجب أن يبدأ بـ 9665 ويتبعه 8 أرقام.");
                  return;
            }
            handleSaveClientInfo();
      };

      return (
            <div className={classes.Information}>
                  <div className={classes.InfoHeader}>
                        <h2>Client Information</h2>
                        {editClientInfo ? (
                              <Group>
                                    <Button variant="outline" size="sm" onClick={() => setEditClientInfo(false)}>
                                          Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSave}>Save</Button>
                              </Group>
                        ) : (
                              <ActionIcon style={{ backgroundColor: "transparent" }} onClick={startEditClientInfo}>
                                    <EditIcon />
                              </ActionIcon>
                        )}
                  </div>
                  <Grid>
                        <Grid.Col span={6}>
                              {editClientInfo ? (
                                    <TextInput
                                          label="Name"
                                          value={formData.client_name}
                                          onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                          size="sm"
                                    />
                              ) : (
                                    <p><strong>Name:</strong><br />{client_request.client_name}</p>
                              )}
                        </Grid.Col>
                        <Grid.Col span={6}>
                              {editClientInfo ? (
                                    <TextInput
                                          label="Phone"
                                          placeholder="5xx xxx xxx"
                                          value={formData.client_phone}
                                          onChange={handlePhoneChange}
                                          onFocus={() => {
                                                if (!formData.client_phone.startsWith("+966")) {
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
                                          error={phoneError}
                                          size="sm"
                                    />
                              ) : (
                                    <p><strong>Phone:</strong><br />{client_request.client_phone}</p>
                              )}
                        </Grid.Col>
                  </Grid>
            </div>
      );
};

export default ClientInfoSection;


 