from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Pelanggan, Stasiun, Sepeda, Peminjaman, Pembayaran
from .serializers import (
    PelangganSerializer, StasiunSerializer,
    SepedaSerializer, PeminjamanSerializer,
    PembayaranSerializer,
)

class PelangganViewSet(viewsets.ModelViewSet):
    queryset = Pelanggan.objects.all()
    serializer_class = PelangganSerializer

class StasiunViewSet(viewsets.ModelViewSet):
    queryset = Stasiun.objects.all()
    serializer_class = StasiunSerializer

class SepedaViewSet(viewsets.ModelViewSet):
    queryset = Sepeda.objects.all()
    serializer_class = SepedaSerializer

class PeminjamanViewSet(viewsets.ModelViewSet):
    queryset = Peminjaman.objects.all()
    serializer_class = PeminjamanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Peminjaman.objects.filter(pelanggan=self.request.user.pelanggan)

    def create(self, request, *args, **kwargs):
        ongoing_rental = Peminjaman.objects.filter(
            pelanggan=request.user.pelanggan, 
            waktu_pengembalian__isnull=True,
            status_pembayaran='Belum Dibayar'
        ).exists()

        if ongoing_rental:
            return Response({'detail': 'Anda masih memiliki peminjaman yang belum selesai atau belum dibayar. Harap selesaikan pembayaran sebelum menyewa sepeda lagi.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        sepeda_id = request.data.get('sepeda')
        sepeda = get_object_or_404(Sepeda, id_sepeda=sepeda_id)
        
        if sepeda.status_sepeda != 'T':
            return Response({'detail': 'Sepeda tidak tersedia.'}, status=status.HTTP_400_BAD_REQUEST)

        peminjaman = Peminjaman.objects.create(
            pelanggan=request.user.pelanggan,
            sepeda=sepeda,
            stasiun_pengambilan=sepeda.stasiun
        )
        
        sepeda.status_sepeda = 'D'
        sepeda.save()

        serializer = self.get_serializer(peminjaman)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PembayaranViewSet(viewsets.ModelViewSet):
    queryset = Pembayaran.objects.all()
    serializer_class = PembayaranSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        peminjaman_id = request.data.get('peminjaman')
        metode_pembayaran = request.data.get('metode_pembayaran')

        try:
            peminjaman = Peminjaman.objects.get(id_peminjaman=peminjaman_id)
        except Peminjaman.DoesNotExist:
            return Response({'detail': 'Rental not found.'}, status=status.HTTP_404_NOT_FOUND)

        if peminjaman.status_pembayaran == 'Sudah Dibayar':
            return Response({'detail': 'This rental has already been paid.'}, status=status.HTTP_400_BAD_REQUEST)

        if not peminjaman.total_biaya:
            return Response({'detail': 'Total cost has not been calculated yet.'}, status=status.HTTP_400_BAD_REQUEST)

        pembayaran = Pembayaran.objects.create(
            peminjaman=peminjaman,
            metode_pembayaran=metode_pembayaran,
            jumlah_pembayaran=peminjaman.total_biaya
        )

        peminjaman.status_pembayaran = 'Sudah Dibayar'
        peminjaman.save()

        sepeda = peminjaman.sepeda
        sepeda.save()

        serializer = self.get_serializer(pembayaran)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        print("POST request received")
        username = request.data.get('username')
        nama = request.data.get('nama')
        email = request.data.get('email')
        no_telp = request.data.get('no_telp')
        password = request.data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Pelanggan.objects.filter(no_telp=no_telp).exists():
            return Response({'error': 'Phone number already used'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        Pelanggan.objects.create(user=user, nama=nama, username=username, email=email, no_telp=no_telp)
        return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)


