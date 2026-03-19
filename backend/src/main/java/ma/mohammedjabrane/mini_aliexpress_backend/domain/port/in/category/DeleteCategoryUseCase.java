package ma.mohammedjabrane.mini_aliexpress_backend.domain.port.in.category;

import java.util.UUID;

public interface DeleteCategoryUseCase {

    void deleteCategory(UUID id);
}
