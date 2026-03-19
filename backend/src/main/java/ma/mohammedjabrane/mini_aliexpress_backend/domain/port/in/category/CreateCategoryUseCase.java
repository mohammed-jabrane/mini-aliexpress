package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;

public interface CreateCategoryUseCase {

    Category createCategory(Category category);
}
