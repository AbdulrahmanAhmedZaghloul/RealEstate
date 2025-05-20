import { Group, Text } from "@mantine/core";
import classes from "../../styles/SettingsCategory.module.css";

function SubcategoryList({ category, onAddClick }) {
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: "1.5rem ",
                    marginTop: "1rem ",
                    color: "var(--color-3)",
                }}>
                <Text
                    fz="md"
                    fw={500}
                >
                    {category.name}
                </Text>

                <Text
                    fz="md"
                    fw={500}
                    onClick={() => onAddClick(category.id)}>+
                </Text>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {category.subcategories?.map((subcategory) => (
                    <div
                        key={subcategory.id}
                        style={{
                            color: 'var(--color-2)',
                            border: '1px solid var(--color-border)',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--color-5)',
                        }}
                        className={classes.flexButton}
                    >
                        {subcategory.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SubcategoryList;
