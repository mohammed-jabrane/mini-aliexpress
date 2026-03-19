package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;

import java.util.UUID;

public interface UpdateCategoryUseCase {

    Category updateCategory(UUID id, Category category);
}
