from rest_framework.routers import DefaultRouter
from .views import GoalViewSet

router = DefaultRouter()
router.register('', GoalViewSet, basename='goal')

urlpatterns = router.urls
