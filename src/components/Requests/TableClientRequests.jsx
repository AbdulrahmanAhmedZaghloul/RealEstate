// src/components/Requests/TableClientRequests.jsx
import   {   useState } from "react"; 
 import { AddClientRequestModal } from "../modals/Request/AddClientRequestModal";
  import { EditClientRequestModal } from "../modals/Request/EditClientRequestModal";
 import { DeleteClientRequestModal } from "../modals/Request/DeleteClientRequestModal";
 import { ClientRequestsTableSection } from "./ClientRequestsTableSection";
import { useTranslation } from "../../context/LanguageContext";
import { FilterClientRequestsModal } from "../modals/Request/FilterClientRequestsModal"; 
export default function TableClientRequests({
      rowsData = [],
      meta = {},
      page,
      onPageChange,
      filters,
      onFilterChange,
      onClearFilters,
      onApplyFilters,
      isFetching,
      appliedFilters = {},
}) {
      const { t } = useTranslation();

      // --- Modal States ---
      const [addOpened, setAddOpened] = useState(false);
      const [filterModalOpened, setFilterModalOpened] = useState(false);
      const [editOpened, setEditOpened] = useState(false);
      const [selectedRequest, setSelectedRequest] = useState(null);
      const [deleteModalOpened, setDeleteModalOpened] = useState(false);
      const [selectedRow, setSelectedRow] = useState(null);
      // --- End Modal States ---

 
      // --- Modal Handlers ---
      const openDeleteModal = (row) => {
            setSelectedRow(row);
            setDeleteModalOpened(true);
      };
 
 
      return (
            <>
                  {/* Add Modal */}

                  <AddClientRequestModal opened={addOpened} onClose={() => setAddOpened(false)} />

                  {/* Delete Modal */}
                  
                  <DeleteClientRequestModal
                        opened={deleteModalOpened}
                        onClose={() => setDeleteModalOpened(false)}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        onDeleteSuccess={() => {
                              // Optional: Add logic here if needed after successful delete
                        }}
                  />

                  {/* Filter Modal */}
                  
                  <FilterClientRequestsModal
                        opened={filterModalOpened}
                        onClose={() => setFilterModalOpened(false)}
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onClearFilters={onClearFilters}
                        onApplyFilters={onApplyFilters}
                        isFetching={isFetching}
                  />

                 
                  {/* ClientTable */}
                  
                  <ClientRequestsTableSection
                        rowsData={rowsData}
                        meta={meta}
                        page={page}
                        onPageChange={onPageChange}
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onClearFilters={onClearFilters}
                        onApplyFilters={onApplyFilters}
                        isFetching={isFetching}
                        appliedFilters={appliedFilters}
                        // Pass modal control functions as props
                        onOpenAddModal={() => setAddOpened(true)}
                        onOpenFilterModal={() => setFilterModalOpened(true)}
                        openDeleteModal={openDeleteModal} 
                        onOpenEditModal={(row) => {
                              setSelectedRequest(row);
                              setEditOpened(true);
                        }}
                  />

                  {/* Edit Request Modal */}
                  
                  <EditClientRequestModal
                        opened={editOpened}
                        onClose={() => {
                              setEditOpened(false);
                              setSelectedRequest(null);
                        }}
                        request={selectedRequest}
                  />
            </>
      );
}
 