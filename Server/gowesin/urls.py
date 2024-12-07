from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PelangganViewSet, StasiunViewSet, SepedaViewSet, PeminjamanViewSet, PembayaranViewSet, LoginView, RegisterView

router = DefaultRouter()
router.register(r'pelanggan', PelangganViewSet)
router.register(r'stasiun', StasiunViewSet)
router.register(r'sepeda', SepedaViewSet)
router.register(r'peminjaman', PeminjamanViewSet)
router.register(r'pembayaran', PembayaranViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view()),
    path('api/register/', RegisterView.as_view()),
]
