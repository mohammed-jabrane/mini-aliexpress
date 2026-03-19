package ma.mohammedjabrane.mini_aliexpress_backend.application.service;

import lombok.RequiredArgsConstructor;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.exception.CategoryNotFoundException;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.CreateCategoryUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.DeleteCategoryUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetAllCategoriesUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetCategoryByIdUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.GetCategoryTreeUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category.UpdateCategoryUseCase;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out.CategoryRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService implements
        CreateCategoryUseCase,
        GetCategoryByIdUseCase,
        GetAllCategoriesUseCase,
        GetCategoryTreeUseCase,
        UpdateCategoryUseCase,
        DeleteCategoryUseCase {

    private final CategoryRepositoryPort categoryRepository;

    @Override
    public Category createCategory(Category category) {
        Category toSave = Category.builder()
                .id(UUID.randomUUID())
                .name(category.getName())
                .parentId(category.getParentId())
                .build();
        return categoryRepository.save(toSave);
    }

    @Override
    @Transactional(readOnly = true)
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getCategoryTree() {
        return categoryRepository.findRootCategories();
    }

    @Override
    public Category updateCategory(UUID id, Category category) {
        Category existing = getCategoryById(id);
        Category updated = Category.builder()
                .id(existing.getId())
                .name(category.getName())
                .parentId(category.getParentId())
                .build();
        return categoryRepository.save(updated);
    }

    @Override
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException(id);
        }
        categoryRepository.deleteById(id);
    }
}
