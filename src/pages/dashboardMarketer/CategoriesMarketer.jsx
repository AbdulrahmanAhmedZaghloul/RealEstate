import {
  ActionIcon,
  Group,
  Table,
  Text,
  Modal,
  Paper,
  TextInput,
  Button,
  Collapse,
  Box,
  Center,
  Loader,
  Card,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import classes from "../../styles/realEstates.module.css";
import right from "../../assets/right.svg";
import down from "../../assets/down.svg";
import edit from "../../assets/edit.svg";
import { useMantineColorScheme } from "@mantine/core";
import { useCategories } from "../../hooks/queries/useCategories";
import { useTranslation } from "../../context/LanguageContext";
import { ThemeToggle } from "../../Settings/ThemeToggle";

function CategoriesMarketer() {
  const { colorScheme } = useMantineColorScheme();
  const { data: categoriesData, isLoading: categoriesLoading, isError: isCategoriesError, error: categoriesError } = useCategories();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const isDark = colorScheme === "dark";
  const { user } = useAuth();
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    addSubModalOpened,
    { open: openAddSubModal, close: closeAddSubModal },
  ] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  // const [searchQuery, setSearchQuery] = useState("");


  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    description: "",
    category_id: "",
  });

  const [editItem, setEditItem] = useState({
    id: "",
    name: "",
    description: "",
    category_id: "",
    isSubcategory: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category_id: "",
  });

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  // const [searchedCategories, setSearchedCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const fetchCategories = async () => {
    try {

      setCategories(categoriesData?.data?.categories || []);
      // setSearchedCategories(categoriesData?.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch categories",
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categoriesData]);

  const validateForm = (item) => {
    const newErrors = {};
    if (!item.name) newErrors.name = "Name is required";
    if (item.isSubcategory && !item.category_id)
      newErrors.category_id = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubcategory = async () => {
    if (!validateForm({ ...newSubcategory, isSubcategory: true })) return;
    setLoading(true);
    try {
      await axiosInstance.post(
        `/api/categories/${newSubcategory.category_id}/subcategories`,
        newSubcategory,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchCategories();
      closeAddSubModal();
      setNewSubcategory({ name: "", description: "", category_id: "" });
      notifications.show({
        title: "Success",
        message: "Subcategory added successfully!",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to add subcategory",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item, isSubcategory = false) => {
    setEditItem({
      id: item.id,
      name: item.name,
      description: item.description,
      category_id: item.category_id || "",
      isSubcategory,
    });
    openEditModal();
  };

  const handleUpdateItem = async () => {
    if (!validateForm(editItem)) return;
    setLoading(true);
    try {
      const endpoint = editItem.isSubcategory
        ? `/api/categories/${editItem.category_id}/subcategories/${editItem.id}`
        : `/api/categories/${editItem.id}`;

      await axiosInstance.put(endpoint, editItem, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      fetchCategories();
      closeEditModal();
      notifications.show({
        title: "Success",
        message: "Item updated successfully!",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to update item",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <>
      {loading && (
        <>
          <Center
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <Loader size="xl" />
          </Center>
        </>
      )}

      <Card style={{ display: "flex", justifyContent: "center" }} radius="lg">
        <span
          mt={"24px"}
          style={{
            fontSize: "24px",
            fontWeight: "500",
            color: isDark ? "var(--color-white)" : "var( --color-grey)",
          }}
        >
          {t.Categories}
        </span>
        {/* <ThemeToggle></ThemeToggle> */}
        <div className={classes.controls}>

          <div className={classes.addAndSort}>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={classes.add}
                onClick={openAddSubModal}
                style={{
                  cursor: "pointer",
                  margin: '0px 10px',
                  backgroundColor: isDark ? "var(--bg-deep)" : "",
                  border: isDark ? "none" : "1px solid #B8C0CC",
                  color: isDark ? "var(--color-white)" : "var( --color-grey)",
                }}
              >
                + {t.Add}
              </button>
            </div>
          </div>
        </div>

        <Table.ScrollContainer radius="lg" shadow="xs" mt={20}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t.Name}</Table.Th>
                <Table.Th>{t.Description}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <Table.Tr>
                    <Table.Td>
                      <Group gap="sm">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => toggleCategoryExpansion(category.id)}
                        >
                          {expandedCategories[category.id] ? (
                            <img src={down} />
                          ) : (
                            <img src={right} />
                          )}
                        </ActionIcon>
                        <Text fz="sm" fw={500}>
                          {category.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{category.description}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={0} justify="flex-end"></Group>
                    </Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td colSpan={3} style={{ padding: 0 }}>
                      <Collapse in={expandedCategories[category.id]}>
                        <Box ml={40}>
                          <Table>
                            <Table.Tbody>
                              {category.subcategories?.map((subcategory) => (
                                <Table.Tr key={subcategory.id}>
                                  <Table.Td>
                                    <Text fz="sm" ml="md">
                                      {subcategory.name}
                                    </Text>
                                  </Table.Td>
                                  <Table.Td>
                                    <Text fz="sm">
                                      {subcategory.description}
                                    </Text>
                                  </Table.Td>
                                  <Table.Td>
                                    <Group gap={0} justify="flex-end">
                                      <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        onClick={() =>
                                          handleEditItem(subcategory, true)
                                        }
                                      >
                                        <img src={edit} />
                                      </ActionIcon>

                                    </Group>
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        </Box>
                      </Collapse>
                    </Table.Td>
                  </Table.Tr>
                </React.Fragment>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Add Subcategory Modal */}
      <Modal
        opened={addSubModalOpened}
        onClose={closeAddSubModal}
        title="Add Subcategory"
        centered
        size="50%"
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Select
            label="Parent Category"
            data={categories.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            value={String(newSubcategory.category_id)}
            onChange={(value) => {
              setNewSubcategory({ ...newSubcategory, category_id: value });
              errors.category_id = "";
            }}
            required
            error={errors.category_id}
          />
          <TextInput
            label="Name"
            placeholder="Subcategory name"
            value={newSubcategory.name}
            onChange={(e) => {
              setNewSubcategory({ ...newSubcategory, name: e.target.value });
              errors.name = "";
            }}
            required
            error={errors.name}
            mt="md"
          />

          <Button
            fullWidth
            mt="md"
            disabled={loading}
            onClick={handleAddSubcategory}
          >
            Add Subcategory
          </Button>
        </Paper>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title={editItem.isSubcategory ? "Edit Subcategory" : "Edit Category"}
        centered
        size="50%"
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Name"
            placeholder={
              editItem.isSubcategory ? "Subcategory name" : "Category name"
            }
            value={editItem.name}
            onChange={(e) => {
              setEditItem({ ...editItem, name: e.target.value });
              errors.name = "";
            }}
            required
            error={errors.name}
            mt="md"
          />
          <TextInput
            label="Description"
            placeholder={
              editItem.isSubcategory
                ? "Subcategory description"
                : "Category description"
            }
            value={editItem.description}
            onChange={(e) => {
              setEditItem({ ...editItem, description: e.target.value });
              errors.description = "";
            }}
            required
            error={errors.description}
            mt="md"
          />
          <Button fullWidth mt="md" onClick={handleUpdateItem}>
            Update {editItem.isSubcategory ? "Subcategory" : "Category"}
          </Button>
        </Paper>
      </Modal>
    </>
  );
}

export default CategoriesMarketer;
