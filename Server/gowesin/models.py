from django.db import models
from django.contrib.auth.models import User

class Pelanggan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='pelanggan')
    id_pelanggan = models.AutoField(primary_key=True)
    nama = models.CharField(max_length=100)
    username = models.CharField(max_length=100, default='default_username')
    email = models.EmailField(unique=True)
    no_telp = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.nama
    
class Stasiun(models.Model):
    id_stasiun = models.AutoField(primary_key=True)
    nama_stasiun = models.CharField(max_length=100)
    lokasi = models.CharField(max_length=200)
    kapasitas = models.IntegerField()

    def __str__(self):
        return self.nama_stasiun
    
class Sepeda(models.Model):
    JENIS_SEPEDA_CHOICES = [
        ('SG', 'Sepeda Gunung'),
        ('SE', 'Sepeda Elektrik'),
        ('SA', 'Sepeda Anak'),
        ('S', 'Skuter'),
    ]

    KONDISI_SEPEDA_CHOICES = [
        ('R', 'Rusak'),
        ('B', 'Baik'),
    ]

    STATUS_SEPEDA_CHOICES = [
        ('T', 'Tersedia'),
        ('TT', 'Tidak Tersedia'),
        ('D', 'Dipinjam'),
    ]

    TARIF_SEPEDA = {
        'SG': 5000,
        'SE': 10000,
        'SA': 3000,
        'S': 7000,
    }

    id_sepeda = models.AutoField(primary_key=True)
    jenis_sepeda = models.CharField(max_length=50, choices=JENIS_SEPEDA_CHOICES)
    kondisi_sepeda = models.CharField(max_length=50, choices=KONDISI_SEPEDA_CHOICES)
    status_sepeda = models.CharField(max_length=20, choices=STATUS_SEPEDA_CHOICES)
    stasiun = models.ForeignKey(Stasiun, on_delete=models.CASCADE, related_name='sepeda_set')

    def biaya_sepeda(self):
        return self.TARIF_SEPEDA.get(self.jenis_sepeda, 0)

    def __str__(self):
        return f"{self.jenis_sepeda} - {self.id_sepeda}"
    
from datetime import timedelta

class Peminjaman(models.Model):
    id_peminjaman = models.AutoField(primary_key=True)
    pelanggan = models.ForeignKey(Pelanggan, on_delete=models.CASCADE, related_name='peminjaman_set')
    sepeda = models.ForeignKey(Sepeda, on_delete=models.CASCADE, related_name='peminjaman_set')
    waktu_pengambilan = models.DateTimeField(auto_now_add=True)
    waktu_pengembalian = models.DateTimeField(null=True, blank=True)
    stasiun_pengambilan = models.ForeignKey(Stasiun, on_delete=models.SET_NULL, null=True, related_name='pengambilan_set')
    stasiun_pengembalian = models.ForeignKey(Stasiun, on_delete=models.SET_NULL, null=True, related_name='pengembalian_set')
    total_biaya = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status_pembayaran = models.CharField(max_length=20, default='Belum Dibayar')

    def save(self, *args, **kwargs):
        if self.waktu_pengembalian:
            durasi = self.waktu_pengembalian - self.waktu_pengambilan
            durasi_jam = round(durasi.total_seconds() / 3600)
            if durasi_jam < 1:
                durasi_jam = 1
            self.total_biaya = self.sepeda.biaya_sepeda() * durasi_jam

            self.sepeda.status_sepeda = 'T'
            self.sepeda.stasiun = self.stasiun_pengembalian
            self.sepeda.save()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Peminjaman {self.id_peminjaman} - {self.pelanggan.nama}"

    
class Pembayaran(models.Model):
    id_pembayaran = models.AutoField(primary_key=True)
    peminjaman = models.OneToOneField(Peminjaman, on_delete=models.CASCADE, related_name='pembayaran')
    metode_pembayaran = models.CharField(max_length=50)
    waktu_pembayaran = models.DateTimeField(auto_now_add=True)
    jumlah_pembayaran = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Pembayaran {self.id_pembayaran} - {self.peminjaman}"