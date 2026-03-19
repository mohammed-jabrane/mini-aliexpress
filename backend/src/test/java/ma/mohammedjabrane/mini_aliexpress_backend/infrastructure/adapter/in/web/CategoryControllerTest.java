package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.mapper.CategoryMapper;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.exception.CategoryNotFoundException;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.CreateCategoryUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.DeleteCategoryUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetAllCategoriesUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetCategoryByIdUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetCategoryTreeUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.UpdateCategoryUseCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("CategoryController")
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CreateCategoryUseCase createCategoryUseCase;

    @MockBean
    private GetAllCategoriesUseCase getAllCategoriesUseCase;

    @MockBean
    private GetCategoryTreeUseCase getCategoryTreeUseCase;

    @MockBean
    private GetCategoryByIdUseCase getCategoryByIdUseCase;

    @MockBean
    private UpdateCategoryUseCase updateCategoryUseCase;

    @MockBean
    private DeleteCategoryUseCase deleteCategoryUseCase;

    @MockBean
    private CategoryMapper categoryMapper;

    // ── POST /categories ────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /categories")
    class Create {

        @Test
        @DisplayName("should return 201 with created category")
        void shouldReturn201WithCreatedCategory() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            CategoryRequestDTO request = new CategoryRequestDTO("Electronics", null);
            Category domain = Category.builder().name("Electronics").build();
            Category created = Category.builder().id(id).name("Electronics").build();
            CategoryResponseDTO response = new CategoryResponseDTO(id, "Electronics", null, List.of());

            when(categoryMapper.toDomain(any(CategoryRequestDTO.class))).thenReturn(domain);
            when(createCategoryUseCase.createCategory(domain)).thenReturn(created);
            when(categoryMapper.toResponse(created)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(post("/categories")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.name").value("Electronics"));
        }

        @Test
        @DisplayName("should return 201 with parentId when provided")
        void shouldReturn201WithParentId() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            UUID parentId = UUID.randomUUID();
            CategoryRequestDTO request = new CategoryRequestDTO("Phones", parentId);
            Category domain = Category.builder().name("Phones").parentId(parentId).build();
            Category created = Category.builder().id(id).name("Phones").parentId(parentId).build();
            CategoryResponseDTO response = new CategoryResponseDTO(id, "Phones", parentId, List.of());

            when(categoryMapper.toDomain(any(CategoryRequestDTO.class))).thenReturn(domain);
            when(createCategoryUseCase.createCategory(domain)).thenReturn(created);
            when(categoryMapper.toResponse(created)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(post("/categories")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.parentId").value(parentId.toString()));
        }
    }

    // ── GET /categories ─────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /categories")
    class ListAll {

        @Test
        @DisplayName("should return 200 with flat category list")
        void shouldReturn200WithFlatList() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            Category category = Category.builder().id(id).name("Books").build();
            CategoryResponseDTO response = new CategoryResponseDTO(id, "Books", null, List.of());

            when(getAllCategoriesUseCase.getAllCategories()).thenReturn(List.of(category));
            when(categoryMapper.toResponse(category)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(get("/categories"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(id.toString()))
                    .andExpect(jsonPath("$[0].name").value("Books"));
        }

        @Test
        @DisplayName("should return 200 with empty list when no categories")
        void shouldReturn200WithEmptyList() throws Exception {
            // GIVEN
            when(getAllCategoriesUseCase.getAllCategories()).thenReturn(List.of());

            // WHEN / THEN
            mockMvc.perform(get("/categories"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isEmpty());
        }
    }

    // ── GET /categories/tree ────────────────────────────────────────────

    @Nested
    @DisplayName("GET /categories/tree")
    class Tree {

        @Test
        @DisplayName("should return 200 with nested tree structure")
        void shouldReturn200WithNestedStructure() throws Exception {
            // GIVEN
            UUID rootId = UUID.randomUUID();
            UUID childId = UUID.randomUUID();
            Category root = Category.builder().id(rootId).name("Root").parentId(null).build();
            Category child = Category.builder().id(childId).name("Child").parentId(rootId).build();

            when(getAllCategoriesUseCase.getAllCategories()).thenReturn(List.of(root, child));

            // WHEN / THEN
            mockMvc.perform(get("/categories/tree"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(rootId.toString()))
                    .andExpect(jsonPath("$[0].name").value("Root"))
                    .andExpect(jsonPath("$[0].children[0].id").value(childId.toString()))
                    .andExpect(jsonPath("$[0].children[0].name").value("Child"));
        }

        @Test
        @DisplayName("should return 200 with empty list when no categories")
        void shouldReturn200WithEmptyList() throws Exception {
            // GIVEN
            when(getAllCategoriesUseCase.getAllCategories()).thenReturn(List.of());

            // WHEN / THEN
            mockMvc.perform(get("/categories/tree"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isEmpty());
        }
    }

    // ── GET /categories/{id} ────────────────────────────────────────────

    @Nested
    @DisplayName("GET /categories/{id}")
    class GetById {

        @Test
        @DisplayName("should return 200 with category when found")
        void shouldReturn200WhenFound() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            Category category = Category.builder().id(id).name("Toys").build();
            CategoryResponseDTO response = new CategoryResponseDTO(id, "Toys", null, List.of());

            when(getCategoryByIdUseCase.getCategoryById(id)).thenReturn(category);
            when(categoryMapper.toResponse(category)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(get("/categories/{id}", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.name").value("Toys"));
        }

        @Test
        @DisplayName("should propagate CategoryNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(getCategoryByIdUseCase.getCategoryById(id))
                    .thenThrow(new CategoryNotFoundException(id));

            // WHEN / THEN
            assertThatThrownBy(() -> mockMvc.perform(get("/categories/{id}", id)))
                    .hasCauseInstanceOf(CategoryNotFoundException.class);
        }
    }

    // ── PUT /categories/{id} ────────────────────────────────────────────

    @Nested
    @DisplayName("PUT /categories/{id}")
    class Update {

        @Test
        @DisplayName("should return 200 with updated category")
        void shouldReturn200WithUpdatedCategory() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();
            CategoryRequestDTO request = new CategoryRequestDTO("Updated", null);
            Category domain = Category.builder().name("Updated").build();
            Category updated = Category.builder().id(id).name("Updated").build();
            CategoryResponseDTO response = new CategoryResponseDTO(id, "Updated", null, List.of());

            when(categoryMapper.toDomain(any(CategoryRequestDTO.class))).thenReturn(domain);
            when(updateCategoryUseCase.updateCategory(eq(id), eq(domain))).thenReturn(updated);
            when(categoryMapper.toResponse(updated)).thenReturn(response);

            // WHEN / THEN
            mockMvc.perform(put("/categories/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id.toString()))
                    .andExpect(jsonPath("$.name").value("Updated"));
        }

        @Test
        @DisplayName("should propagate CategoryNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            CategoryRequestDTO request = new CategoryRequestDTO("Updated", null);
            Category domain = Category.builder().name("Updated").build();

            when(categoryMapper.toDomain(any(CategoryRequestDTO.class))).thenReturn(domain);
            when(updateCategoryUseCase.updateCategory(eq(id), eq(domain)))
                    .thenThrow(new CategoryNotFoundException(id));

            // WHEN / THEN
            assertThatThrownBy(() -> mockMvc.perform(put("/categories/{id}", id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request))))
                    .hasCauseInstanceOf(CategoryNotFoundException.class);
        }
    }

    // ── DELETE /categories/{id} ─────────────────────────────────────────

    @Nested
    @DisplayName("DELETE /categories/{id}")
    class Delete {

        @Test
        @DisplayName("should return 204 No Content")
        void shouldReturn204() throws Exception {
            // GIVEN
            UUID id = UUID.randomUUID();

            // WHEN / THEN
            mockMvc.perform(delete("/categories/{id}", id))
                    .andExpect(status().isNoContent());

            verify(deleteCategoryUseCase).deleteCategory(id);
        }

        @Test
        @DisplayName("should propagate CategoryNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            doThrow(new CategoryNotFoundException(id))
                    .when(deleteCategoryUseCase).deleteCategory(id);

            // WHEN / THEN
            assertThatThrownBy(() -> mockMvc.perform(delete("/categories/{id}", id)))
                    .hasCauseInstanceOf(CategoryNotFoundException.class);
        }
    }
}
