// SettingsCategory.jsx

import React, { useEffect, useState } from 'react';
import { useCategories } from '../../hooks/queries/useCategories';
import { notifications } from "@mantine/notifications";
import {
    Group,
    Text,
    Center,
    Loader,
} from "@mantine/core";
import classes from "../../styles/SettingsCategory.module.css";
import { useDisclosure } from '@mantine/hooks';
import AddSubcategoryModal from './AddSubcategoryModal';
import SubcategoryList from './SubcategoryList';

function SettingsCategory() {
    const { data: categoriesData } = useCategories();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [
        addSubModalOpened,
        { open: openAddSubModal, close: closeAddSubModal }
    ] = useDisclosure(false);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const fetchCategories = async () => {
        try {
            setCategories(categoriesData?.data?.categories || []);
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

    const handleOpenAddSubModal = (categoryId) => {
        setSelectedCategoryId(categoryId); // ← حفظ الـ category_id المحدد
        openAddSubModal();
    };

    return (
        <>
            {loading && (
                <Center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
                    <Loader size="xl" />
                </Center>
            )}

            <div>
                {categories.map((category) => (
                    <SubcategoryList
                        key={category.id}
                        category={category}
                        onAddClick={handleOpenAddSubModal} // ← تم تمرير categoryId هنا
                    />
                ))}

                <AddSubcategoryModal
                    opened={addSubModalOpened}
                    onClose={closeAddSubModal}
                    categories={categories}
                    selectedCategoryId={selectedCategoryId} // ← تمرير الـ category_id المحدد
                    fetchCategories={fetchCategories}
                />
            </div>
        </>
    );
}

export default SettingsCategory;  
