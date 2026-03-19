package ma.mohammedjabrane.mini_aliexpress_backend.application.service;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.exception.CategoryNotFoundException;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out.CategoryRepositoryPort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryService")
class CategoryServiceTest {

    @Mock
    private CategoryRepositoryPort categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    // ── createCategory ──────────────────────────────────────────────────

    @Nested
    @DisplayName("createCategory")
    class CreateCategory {

        @Test
        @DisplayName("should generate id and save category")
        void shouldGenerateIdAndSave() {
            // GIVEN
            Category input = Category.builder().name("Electronics").parentId(null).build();
            when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

            // WHEN
            Category result = categoryService.createCategory(input);

            // THEN
            assertThat(result.getId()).isNotNull();
            assertThat(result.getName()).isEqualTo("Electronics");
            assertThat(result.getParentId()).isNull();
            verify(categoryRepository).save(any(Category.class));
        }

        @Test
        @DisplayName("should preserve parentId when provided")
        void shouldPreserveParentId() {
            // GIVEN
            UUID parentId = UUID.randomUUID();
            Category input = Category.builder().name("Phones").parentId(parentId).build();
            when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

            // WHEN
            Category result = categoryService.createCategory(input);

            // THEN
            assertThat(result.getId()).isNotNull();
            assertThat(result.getName()).isEqualTo("Phones");
            assertThat(result.getParentId()).isEqualTo(parentId);
        }
    }

    // ── getCategoryById ─────────────────────────────────────────────────

    @Nested
    @DisplayName("getCategoryById")
    class GetCategoryById {

        @Test
        @DisplayName("should return category when found")
        void shouldReturnCategoryWhenFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            Category category = Category.builder().id(id).name("Books").build();
            when(categoryRepository.findById(id)).thenReturn(Optional.of(category));

            // WHEN
            Category result = categoryService.getCategoryById(id);

            // THEN
            assertThat(result.getId()).isEqualTo(id);
            assertThat(result.getName()).isEqualTo("Books");
        }

        @Test
        @DisplayName("should throw CategoryNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(categoryRepository.findById(id)).thenReturn(Optional.empty());

            // WHEN / THEN
            assertThatThrownBy(() -> categoryService.getCategoryById(id))
                    .isInstanceOf(CategoryNotFoundException.class)
                    .hasMessageContaining(id.toString());
        }
    }

    // ── getAllCategories ─────────────────────────────────────────────────

    @Nested
    @DisplayName("getAllCategories")
    class GetAllCategories {

        @Test
        @DisplayName("should return all categories")
        void shouldReturnAll() {
            // GIVEN
            List<Category> categories = List.of(
                    Category.builder().id(UUID.randomUUID()).name("A").build(),
                    Category.builder().id(UUID.randomUUID()).name("B").build()
            );
            when(categoryRepository.findAll()).thenReturn(categories);

            // WHEN
            List<Category> result = categoryService.getAllCategories();

            // THEN
            assertThat(result).hasSize(2);
            verify(categoryRepository).findAll();
        }

        @Test
        @DisplayName("should return empty list when none exist")
        void shouldReturnEmptyListWhenNoneExist() {
            // GIVEN
            when(categoryRepository.findAll()).thenReturn(List.of());

            // WHEN
            List<Category> result = categoryService.getAllCategories();

            // THEN
            assertThat(result).isEmpty();
        }
    }

    // ── getCategoryTree ─────────────────────────────────────────────────

    @Nested
    @DisplayName("getCategoryTree")
    class GetCategoryTree {

        @Test
        @DisplayName("should return root categories")
        void shouldReturnRootCategories() {
            // GIVEN
            List<Category> roots = List.of(
                    Category.builder().id(UUID.randomUUID()).name("Root").build()
            );
            when(categoryRepository.findRootCategories()).thenReturn(roots);

            // WHEN
            List<Category> result = categoryService.getCategoryTree();

            // THEN
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("Root");
            verify(categoryRepository).findRootCategories();
        }

        @Test
        @DisplayName("should return empty list when no root categories")
        void shouldReturnEmptyListWhenNoRoots() {
            // GIVEN
            when(categoryRepository.findRootCategories()).thenReturn(List.of());

            // WHEN
            List<Category> result = categoryService.getCategoryTree();

            // THEN
            assertThat(result).isEmpty();
        }
    }

    // ── updateCategory ──────────────────────────────────────────────────

    @Nested
    @DisplayName("updateCategory")
    class UpdateCategory {

        @Test
        @DisplayName("should update name and save")
        void shouldUpdateNameAndSave() {
            // GIVEN
            UUID id = UUID.randomUUID();
            Category existing = Category.builder().id(id).name("Old").parentId(null).build();
            Category input = Category.builder().name("New").parentId(null).build();
            when(categoryRepository.findById(id)).thenReturn(Optional.of(existing));
            when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

            // WHEN
            Category result = categoryService.updateCategory(id, input);

            // THEN
            assertThat(result.getId()).isEqualTo(id);
            assertThat(result.getName()).isEqualTo("New");
            verify(categoryRepository).save(any(Category.class));
        }

        @Test
        @DisplayName("should update parentId")
        void shouldUpdateParentId() {
            // GIVEN
            UUID id = UUID.randomUUID();
            UUID newParentId = UUID.randomUUID();
            Category existing = Category.builder().id(id).name("Child").parentId(null).build();
            Category input = Category.builder().name("Child").parentId(newParentId).build();
            when(categoryRepository.findById(id)).thenReturn(Optional.of(existing));
            when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

            // WHEN
            Category result = categoryService.updateCategory(id, input);

            // THEN
            assertThat(result.getId()).isEqualTo(id);
            assertThat(result.getParentId()).isEqualTo(newParentId);
        }

        @Test
        @DisplayName("should throw CategoryNotFoundException when not found")
        void shouldThrowWhenNotFound() {
            // GIVEN
            UUID id = UUID.randomUUID();
            Category input = Category.builder().name("New").build();
            when(categoryRepository.findById(id)).thenReturn(Optional.empty());

            // WHEN / THEN
            assertThatThrownBy(() -> categoryService.updateCategory(id, input))
                    .isInstanceOf(CategoryNotFoundException.class)
                    .hasMessageContaining(id.toString());
            verify(categoryRepository, never()).save(any());
        }
    }

    // ── deleteCategory ──────────────────────────────────────────────────

    @Nested
    @DisplayName("deleteCategory")
    class DeleteCategory {

        @Test
        @DisplayName("should delete when category exists")
        void shouldDeleteWhenExists() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(categoryRepository.existsById(id)).thenReturn(true);

            // WHEN
            categoryService.deleteCategory(id);

            // THEN
            verify(categoryRepository).deleteById(id);
        }

        @Test
        @DisplayName("should throw CategoryNotFoundException when not found")
        void shouldThrowWhenNotExists() {
            // GIVEN
            UUID id = UUID.randomUUID();
            when(categoryRepository.existsById(id)).thenReturn(false);

            // WHEN / THEN
            assertThatThrownBy(() -> categoryService.deleteCategory(id))
                    .isInstanceOf(CategoryNotFoundException.class)
                    .hasMessageContaining(id.toString());
            verify(categoryRepository, never()).deleteById(any());
        }
    }
}
