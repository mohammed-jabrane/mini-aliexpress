package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category;

import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;

import java.util.List;

public interface GetCategoryTreeUseCase {

    List<Category> getCategoryTree();
}
