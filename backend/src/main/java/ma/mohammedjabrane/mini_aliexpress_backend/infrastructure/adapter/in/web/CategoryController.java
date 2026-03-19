package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.in.web;

import lombok.RequiredArgsConstructor;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryRequestDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryResponseDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.application.mapper.CategoryMapper;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.CreateCategoryUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.DeleteCategoryUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetAllCategoriesUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetCategoryByIdUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetCategoryTreeUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.UpdateCategoryUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CreateCategoryUseCase createCategoryUseCase;
    private final GetAllCategoriesUseCase getAllCategoriesUseCase;
    private final GetCategoryTreeUseCase getCategoryTreeUseCase;
    private final GetCategoryByIdUseCase getCategoryByIdUseCase;
    private final UpdateCategoryUseCase updateCategoryUseCase;
    private final DeleteCategoryUseCase deleteCategoryUseCase;
    private final CategoryMapper categoryMapper;

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> create(@RequestBody CategoryRequestDTO request) {
        Category category = categoryMapper.toDomain(request);
        Category created = createCategoryUseCase.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryMapper.toResponse(created));
    }

    @GetMapping
    public List<CategoryResponseDTO> list() {
        return getAllCategoriesUseCase.getAllCategories().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @GetMapping("/tree")
    public List<CategoryResponseDTO> tree() {
        List<Category> all = getAllCategoriesUseCase.getAllCategories();

        Map<UUID, CategoryResponseDTO> map = new LinkedHashMap<>();
        for (Category c : all) {
            map.put(c.getId(), new CategoryResponseDTO(c.getId(), c.getName(), c.getParentId(), new ArrayList<>()));
        }

        List<CategoryResponseDTO> roots = new ArrayList<>();
        for (CategoryResponseDTO dto : map.values()) {
            if (dto.parentId() == null) {
                roots.add(dto);
            } else {
                CategoryResponseDTO parent = map.get(dto.parentId());
                if (parent != null) {
                    parent.children().add(dto);
                }
            }
        }

        return roots;
    }

    @GetMapping("/{id}")
    public CategoryResponseDTO getById(@PathVariable UUID id) {
        return categoryMapper.toResponse(getCategoryByIdUseCase.getCategoryById(id));
    }

    @PutMapping("/{id}")
    public CategoryResponseDTO update(@PathVariable UUID id, @RequestBody CategoryRequestDTO request) {
        Category category = categoryMapper.toDomain(request);
        return categoryMapper.toResponse(updateCategoryUseCase.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deleteCategoryUseCase.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
