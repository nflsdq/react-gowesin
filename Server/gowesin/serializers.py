from rest_framework import serializers
from .models import Pelanggan, Stasiun, Sepeda, Peminjaman, Pembayaran

class PelangganSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pelanggan
        fields = ('__all__')

class StasiunSerializer(serializers.ModelSerializer):
    jumlah_sepeda = serializers.SerializerMethodField()
    
    class Meta:
        model = Stasiun
        fields = ('__all__')

    def get_jumlah_sepeda(self, obj):
        return obj.sepeda_set.filter(status_sepeda='T').count()

class SepedaSerializer(serializers.ModelSerializer):
    jenis_sepeda_display = serializers.CharField(source='get_jenis_sepeda_display', read_only=True)
    kondisi_sepeda_display = serializers.CharField(source='get_kondisi_sepeda_display', read_only=True)
    status_sepeda_display = serializers.CharField(source='get_status_sepeda_display', read_only=True)
    stasiun = serializers.PrimaryKeyRelatedField(queryset=Stasiun.objects.all())
    stasiun_detail = StasiunSerializer(source='stasiun', read_only=True)
    biaya_sepeda = serializers.SerializerMethodField()

    class Meta:
        model = Sepeda
        fields = ('__all__')

    def get_biaya_sepeda(self, obj):
        return obj.biaya_sepeda()

class PeminjamanSerializer(serializers.ModelSerializer):
    id_peminjaman = serializers.SerializerMethodField()
    waktu_pengambilan = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")
    waktu_pengembalian = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")

    class Meta:
        model = Peminjaman
        fields = ('__all__')

    def get_id_peminjaman(self, obj):
        tanggal = obj.waktu_pengambilan.strftime("%d%m") if obj.waktu_pengambilan else "00-00"
        return f"{tanggal}{obj.id_peminjaman}"

class PembayaranSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pembayaran
        fields = ('__all__')