export interface CodeFile {
  id: string;
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export const BUILD_GRADLE_KTS = `// build.gradle.kts (Module: app)
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.consultacnpj"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.consultacnpj"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")

    // Jetpack Compose BOM & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Lifecycle ViewModel para Compose (viewModel() hook e collectAsStateWithLifecycle)
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // Retrofit 2 & Conversor Gson para consumo de APIs REST
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")

    // OkHttp & Logging Interceptor (útil para inspecionar requisições e respostas HTTP)
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Kotlin Coroutines para operações assíncronas
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Testes
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`;

export const ANDROID_MANIFEST_XML = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permissão obrigatória para acesso à internet (BrasilAPI) -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="Consulta CNPJ"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:theme="@android:style/Theme.Material.Light.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`;

export const SINGLE_FILE_APP_KT = `package com.example.consultacnpj

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.*
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import java.util.concurrent.TimeUnit

// ============================================================================
// 1. MODELOS DE DADOS (DATA CLASSES)
// ============================================================================

data class CnpjResponse(
    @SerializedName("cnpj") val cnpj: String? = null,
    @SerializedName("razao_social") val razaoSocial: String? = null,
    @SerializedName("nome_fantasia") val nomeFantasia: String? = null,
    @SerializedName("data_inicio_atividade") val dataInicioAtividade: String? = null,
    @SerializedName("porte") val porte: String? = null,
    @SerializedName("descricao_porte") val descricaoPorte: String? = null,
    @SerializedName("cnae_fiscal") val cnaeFiscal: Long? = null,
    @SerializedName("cnae_fiscal_descricao") val cnaeFiscalDescricao: String? = null,
    @SerializedName("cnaes_secundarios") val cnaesSecundarios: List<CnaeSecundario>? = null,
    @SerializedName("codigo_natureza_juridica") val codigoNaturezaJuridica: Int? = null,
    @SerializedName("natureza_juridica") val naturezaJuridica: String? = null,
    @SerializedName("descricao_tipo_de_logradouro") val tipoLogradouro: String? = null,
    @SerializedName("logradouro") val logradouro: String? = null,
    @SerializedName("numero") val numero: String? = null,
    @SerializedName("complemento") val complemento: String? = null,
    @SerializedName("cep") val cep: String? = null,
    @SerializedName("bairro") val bairro: String? = null,
    @SerializedName("municipio") val municipio: String? = null,
    @SerializedName("uf") val uf: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("ddd_telefone_1") val telefone1: String? = null,
    @SerializedName("ddd_telefone_2") val telefone2: String? = null,
    @SerializedName("ente_federativo_responsavel") val enteFederativo: String? = null,
    @SerializedName("situacao_cadastral") val situacaoCadastral: String? = null,
    @SerializedName("descricao_situacao_cadastral") val descricaoSituacaoCadastral: String? = null,
    @SerializedName("data_situacao_cadastral") val dataSituacaoCadastral: String? = null,
    @SerializedName("motivo_situacao_cadastral") val motivoSituacaoCadastral: Int? = null,
    @SerializedName("descricao_motivo_situacao_cadastral") val descricaoMotivoSituacaoCadastral: String? = null,
    @SerializedName("situacao_especial") val situacaoEspecial: String? = null,
    @SerializedName("data_situacao_especial") val dataSituacaoEspecial: String? = null
)

data class CnaeSecundario(
    @SerializedName("codigo") val codigo: Long? = null,
    @SerializedName("descricao") val descricao: String? = null
)

// ============================================================================
// 2. RETROFIT API SERVICE & CLIENT
// ============================================================================

interface BrasilApiService {
    @GET("api/cnpj/v1/{cnpj}")
    suspend fun consultarCnpj(
        @Path("cnpj") cnpj: String
    ): CnpjResponse

    companion object {
        private const val BASE_URL = "https://brasilapi.com.br/"

        fun create(): BrasilApiService {
            val loggingInterceptor = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .connectTimeout(15, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .build()

            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(BrasilApiService::class.java)
        }
    }
}

// ============================================================================
// 3. ESTADO DA UI & VIEWMODEL
// ============================================================================

sealed interface CnpjUiState {
    object Idle : CnpjUiState
    object Loading : CnpjUiState
    data class Success(val empresa: CnpjResponse) : CnpjUiState
    data class Error(val mensagem: String) : CnpjUiState
}

class CnpjViewModel(
    private val apiService: BrasilApiService = BrasilApiService.create()
) : ViewModel() {

    private val _uiState = MutableStateFlow<CnpjUiState>(CnpjUiState.Idle)
    val uiState: StateFlow<CnpjUiState> = _uiState.asStateFlow()

    private val _cnpjInput = MutableStateFlow("")
    val cnpjInput: StateFlow<String> = _cnpjInput.asStateFlow()

    fun onCnpjChange(novoValor: String) {
        // Aceita apenas números e limita ao tamanho do CNPJ (14 dígitos)
        val numeros = novoValor.filter { it.isDigit() }.take(14)
        _cnpjInput.value = numeros
    }

    fun buscarCnpj() {
        val cnpjLimpo = _cnpjInput.value.filter { it.isDigit() }

        if (cnpjLimpo.length != 14) {
            _uiState.value = CnpjUiState.Error("O CNPJ deve conter exatamente 14 dígitos.")
            return
        }

        viewModelScope.launch {
            _uiState.value = CnpjUiState.Loading
            try {
                val resultado = apiService.consultarCnpj(cnpjLimpo)
                _uiState.value = CnpjUiState.Success(resultado)
            } catch (e: retrofit2.HttpException) {
                val mensagem = when (e.code()) {
                    400 -> "CNPJ inválido de acordo com as regras da Receita Federal."
                    404 -> "CNPJ não encontrado na base de dados pública."
                    else -> "Erro no servidor (Código \${e.code()}). Tente novamente."
                }
                _uiState.value = CnpjUiState.Error(mensagem)
            } catch (e: java.io.IOException) {
                _uiState.value = CnpjUiState.Error("Falha de conexão. Verifique sua internet.")
            } catch (e: Exception) {
                _uiState.value = CnpjUiState.Error("Ocorreu um erro inesperado: \${e.localizedMessage}")
            }
        }
    }

    fun limparBusca() {
        _cnpjInput.value = ""
        _uiState.value = CnpjUiState.Idle
    }
}

// ============================================================================
// 4. MÁSCARA VISUAL PARA CNPJ (00.000.000/0000-00)
// ============================================================================

class CnpjVisualTransformation : VisualTransformation {
    override fun filter(text: AnnotatedString): TransformedText {
        val digits = text.text.filter { it.isDigit() }.take(14)
        val out = StringBuilder()

        for (i in digits.indices) {
            out.append(digits[i])
            if (i == 1 || i == 4) out.append('.')
            if (i == 7) out.append('/')
            if (i == 11) out.append('-')
        }

        val offsetMapping = object : OffsetMapping {
            override fun originalToTransformed(offset: Int): Int {
                if (offset <= 2) return offset
                if (offset <= 5) return offset + 1
                if (offset <= 8) return offset + 2
                if (offset <= 12) return offset + 3
                if (offset <= 14) return offset + 4
                return 18
            }

            override fun transformedToOriginal(offset: Int): Int {
                if (offset <= 2) return offset
                if (offset <= 6) return (offset - 1).coerceAtLeast(0)
                if (offset <= 10) return (offset - 2).coerceAtLeast(0)
                if (offset <= 15) return (offset - 3).coerceAtLeast(0)
                if (offset <= 18) return (offset - 4).coerceAtLeast(0)
                return 14
            }
        }

        return TransformedText(AnnotatedString(out.toString()), offsetMapping)
    }
}

// ============================================================================
// 5. TELAS E COMPONENTES COMPOSE (UI)
// ============================================================================

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(viewModel: CnpjViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    val cnpjInput by viewModel.cnpjInput.collectAsState()
    val focusManager = LocalFocusManager.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Business,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Consulta CNPJ",
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Campo de texto para CNPJ
            OutlinedTextField(
                value = cnpjInput,
                onValueChange = { viewModel.onCnpjChange(it) },
                label = { Text("Número do CNPJ") },
                placeholder = { Text("00.000.000/0000-00") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Search, contentDescription = null)
                },
                trailingIcon = {
                    if (cnpjInput.isNotEmpty()) {
                        IconButton(onClick = { viewModel.limparBusca() }) {
                            Icon(imageVector = Icons.Default.Clear, contentDescription = "Limpar")
                        }
                    }
                },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.NumberPassword,
                    imeAction = ImeAction.Search
                ),
                keyboardActions = KeyboardActions(
                    onSearch = {
                        focusManager.clearFocus()
                        viewModel.buscarCnpj()
                    }
                ),
                visualTransformation = CnpjVisualTransformation(),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Botão Consultar
            Button(
                onClick = {
                    focusManager.clearFocus()
                    viewModel.buscarCnpj()
                },
                enabled = cnpjInput.length == 14 && uiState !is CnpjUiState.Loading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Default.Search, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Consultar CNPJ", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Gerenciamento dos estados da UI
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.TopCenter
            ) {
                when (val state = uiState) {
                    is CnpjUiState.Idle -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "Digite um CNPJ com 14 dígitos e clique em Consultar.",
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                    is CnpjUiState.Loading -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                CircularProgressIndicator()
                                Spacer(modifier = Modifier.height(12.dp))
                                Text("Consultando base de dados pública...")
                            }
                        }
                    }
                    is CnpjUiState.Error -> {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.errorContainer
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Warning,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.error
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(
                                    text = state.mensagem,
                                    color = MaterialTheme.colorScheme.onErrorContainer,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                        }
                    }
                    is CnpjUiState.Success -> {
                        CompanyDetailsList(empresa = state.empresa)
                    }
                }
            }
        }
    }
}

@Composable
fun CompanyDetailsList(empresa: CnpjResponse) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // 1. Identificação Principal & Porte
        item {
            InfoSectionCard(
                title = "Identificação da Empresa",
                icon = Icons.Default.Domain
            ) {
                InfoField(label = "Razão Social", value = empresa.razaoSocial)
                InfoField(label = "Nome Fantasia", value = empresa.nomeFantasia)
                InfoField(label = "CNPJ", value = formatarCnpjString(empresa.cnpj))
                InfoField(label = "Data de Abertura", value = formatarData(empresa.dataInicioAtividade))
                InfoField(
                    label = "Porte da Empresa",
                    value = empresa.descricaoPorte ?: empresa.porte
                )
                InfoField(
                    label = "Ente Federativo Responsável",
                    value = empresa.enteFederativo
                )
            }
        }

        // 2. Situação Cadastral
        item {
            val statusColor = when (empresa.descricaoSituacaoCadastral?.uppercase()) {
                "ATIVA" -> Color(0xFF2E7D32)
                "SUSPENSA" -> Color(0xFFE65100)
                "BAIXADA", "INAPTA", "NULA" -> Color(0xFFC62828)
                else -> MaterialTheme.colorScheme.primary
            }

            InfoSectionCard(
                title = "Situação Cadastral",
                icon = Icons.Default.CheckCircle
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Situação Cadastral",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Surface(
                        color = statusColor.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = empresa.descricaoSituacaoCadastral ?: "NÃO INFORMADA",
                            color = statusColor,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
                InfoField(
                    label = "Data da Situação Cadastral",
                    value = formatarData(empresa.dataSituacaoCadastral)
                )
                InfoField(
                    label = "Motivo da Situação Cadastral",
                    value = empresa.descricaoMotivoSituacaoCadastral
                        ?: empresa.motivoSituacaoCadastral?.toString()
                )
                InfoField(
                    label = "Situação Especial",
                    value = empresa.situacaoEspecial
                )
                InfoField(
                    label = "Data da Situação Especial",
                    value = formatarData(empresa.dataSituacaoEspecial)
                )
            }
        }

        // 3. Atividades Econômicas
        item {
            InfoSectionCard(
                title = "Atividades Econômicas",
                icon = Icons.Default.Work
            ) {
                Text(
                    text = "Atividade Econômica Principal",
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.bodyMedium
                )
                val cnaePrincipal = buildString {
                    if (empresa.cnaeFiscal != null) append("CNAE \${empresa.cnaeFiscal}: ")
                    append(empresa.cnaeFiscalDescricao ?: "Não informada")
                }
                Text(
                    text = cnaePrincipal,
                    style = MaterialTheme.typography.bodyMedium
                )

                Spacer(modifier = Modifier.height(8.dp))
                HorizontalDivider()
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Atividades Econômicas Secundárias",
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.bodyMedium
                )
                if (empresa.cnaesSecundarios.isNullOrEmpty()) {
                    Text(
                        text = "Nenhuma atividade secundária informada.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                } else {
                    empresa.cnaesSecundarios.forEach { cnae ->
                        Text(
                            text = "• \${cnae.codigo}: \${cnae.descricao}",
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(vertical = 2.dp)
                        )
                    }
                }
            }
        }

        // 4. Natureza Jurídica
        item {
            InfoSectionCard(
                title = "Natureza Jurídica",
                icon = Icons.Default.Gavel
            ) {
                val natJuridica = buildString {
                    if (empresa.codigoNaturezaJuridica != null) {
                        append("[\${empresa.codigoNaturezaJuridica}] ")
                    }
                    append(empresa.naturezaJuridica ?: "Não informada")
                }
                InfoField(label = "Código e Descrição", value = natJuridica)
            }
        }

        // 5. Endereço & Localização
        item {
            InfoSectionCard(
                title = "Endereço e Localização",
                icon = Icons.Default.LocationOn
            ) {
                val logradouroCompleto = buildString {
                    if (!empresa.tipoLogradouro.isNullOrBlank()) append("\${empresa.tipoLogradouro} ")
                    append(empresa.logradouro ?: "")
                }
                InfoField(label = "Logradouro", value = logradouroCompleto)
                InfoField(label = "Número", value = empresa.numero)
                InfoField(label = "Complemento", value = empresa.complemento)
                InfoField(label = "Bairro", value = empresa.bairro)
                InfoField(label = "CEP", value = formatarCep(empresa.cep))
                InfoField(label = "Município / UF", value = "\${empresa.municipio ?: ""} - \${empresa.uf ?: ""}")
            }
        }

        // 6. Contatos
        item {
            InfoSectionCard(
                title = "Contato",
                icon = Icons.Default.Phone
            ) {
                InfoField(label = "Endereço Eletrônico (E-mail)", value = empresa.email)
                val telefones = listOfNotNull(
                    empresa.telefone1?.takeIf { it.isNotBlank() },
                    empresa.telefone2?.takeIf { it.isNotBlank() }
                ).joinToString(" / ")
                InfoField(label = "Telefone", value = telefones)
            }
        }
    }
}

// ============================================================================
// COMPONENTES REUTILIZÁVEIS
// ============================================================================

@Composable
fun InfoSectionCard(
    title: String,
    icon: ImageVector,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp))
            content()
        }
    }
}

@Composable
fun InfoField(label: String, value: String?) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp)) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = if (value.isNullOrBlank()) "Não informado" else value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

// ============================================================================
// FUNÇÕES UTILITÁRIAS DE FORMATAÇÃO
// ============================================================================

fun formatarCnpjString(cnpj: String?): String {
    if (cnpj == null) return "Não informado"
    val digitos = cnpj.filter { it.isDigit() }
    if (digitos.length != 14) return cnpj
    return "\${digitos.substring(0, 2)}.\${digitos.substring(2, 5)}.\${digitos.substring(5, 8)}/\${digitos.substring(8, 12)}-\${digitos.substring(12, 14)}"
}

fun formatarCep(cep: String?): String {
    if (cep == null) return "Não informado"
    val d = cep.filter { it.isDigit() }
    if (d.length == 8) return "\${d.substring(0, 5)}-\${d.substring(5)}"
    return cep
}

fun formatarData(dataIso: String?): String {
    if (dataIso.isNullOrBlank()) return "Não informada"
    val partes = dataIso.split("-")
    if (partes.size == 3) {
        return "\${partes[2]}/\${partes[1]}/\${partes[0]}"
    }
    return dataIso
}

// ============================================================================
// ACTIVITY PRINCIPAL
// ============================================================================

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainScreen()
                }
            }
        }
    }
}
`;

export const CODE_FILES: CodeFile[] = [
  {
    id: 'single_file',
    name: 'MainActivity.kt (Arquivo Único Completo)',
    path: 'app/src/main/java/com/example/consultacnpj/MainActivity.kt',
    language: 'kotlin',
    description: 'Solução completa em 1 único arquivo: Data Classes, Retrofit, ViewModel, StateFlow, Máscara e Telas Compose.',
    code: SINGLE_FILE_APP_KT
  },
  {
    id: 'build_gradle',
    name: 'build.gradle.kts (Dependências)',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Dependências do Retrofit2, Gson Converter, OkHttp, Lifecycle ViewModel Compose, Material 3 e Coroutines.',
    code: BUILD_GRADLE_KTS
  },
  {
    id: 'android_manifest',
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Configuração do manifesto com a permissão android.permission.INTERNET.',
    code: ANDROID_MANIFEST_XML
  },
  {
    id: 'model',
    name: 'CnpjResponse.kt (Data Class)',
    path: 'app/src/main/java/com/example/consultacnpj/data/model/CnpjResponse.kt',
    language: 'kotlin',
    description: 'Modelos de dados estruturados com anotações @SerializedName mapeando os campos da BrasilAPI.',
    code: `package com.example.consultacnpj.data.model

import com.google.gson.annotations.SerializedName

/**
 * Representa os dados cadastrais da empresa retornados pela BrasilAPI:
 * https://brasilapi.com.br/api/cnpj/v1/{cnpj}
 */
data class CnpjResponse(
    @SerializedName("cnpj") 
    val cnpj: String? = null,

    @SerializedName("razao_social") 
    val razaoSocial: String? = null,

    @SerializedName("nome_fantasia") 
    val nomeFantasia: String? = null,

    @SerializedName("data_inicio_atividade") 
    val dataInicioAtividade: String? = null,

    @SerializedName("porte") 
    val porte: String? = null,

    @SerializedName("descricao_porte") 
    val descricaoPorte: String? = null,

    @SerializedName("cnae_fiscal") 
    val cnaeFiscal: Long? = null,

    @SerializedName("cnae_fiscal_descricao") 
    val cnaeFiscalDescricao: String? = null,

    @SerializedName("cnaes_secundarios") 
    val cnaesSecundarios: List<CnaeSecundario>? = null,

    @SerializedName("codigo_natureza_juridica") 
    val codigoNaturezaJuridica: Int? = null,

    @SerializedName("natureza_juridica") 
    val naturezaJuridica: String? = null,

    @SerializedName("descricao_tipo_de_logradouro") 
    val tipoLogradouro: String? = null,

    @SerializedName("logradouro") 
    val logradouro: String? = null,

    @SerializedName("numero") 
    val numero: String? = null,

    @SerializedName("complemento") 
    val complemento: String? = null,

    @SerializedName("cep") 
    val cep: String? = null,

    @SerializedName("bairro") 
    val bairro: String? = null,

    @SerializedName("municipio") 
    val municipio: String? = null,

    @SerializedName("uf") 
    val uf: String? = null,

    @SerializedName("email") 
    val email: String? = null,

    @SerializedName("ddd_telefone_1") 
    val telefone1: String? = null,

    @SerializedName("ddd_telefone_2") 
    val telefone2: String? = null,

    @SerializedName("ente_federativo_responsavel") 
    val enteFederativo: String? = null,

    @SerializedName("situacao_cadastral") 
    val situacaoCadastral: String? = null,

    @SerializedName("descricao_situacao_cadastral") 
    val descricaoSituacaoCadastral: String? = null,

    @SerializedName("data_situacao_cadastral") 
    val dataSituacaoCadastral: String? = null,

    @SerializedName("motivo_situacao_cadastral") 
    val motivoSituacaoCadastral: Int? = null,

    @SerializedName("descricao_motivo_situacao_cadastral") 
    val descricaoMotivoSituacaoCadastral: String? = null,

    @SerializedName("situacao_especial") 
    val situacaoEspecial: String? = null,

    @SerializedName("data_situacao_especial") 
    val dataSituacaoEspecial: String? = null
)

data class CnaeSecundario(
    @SerializedName("codigo") val codigo: Long? = null,
    @SerializedName("descricao") val descricao: String? = null
)
`
  },
  {
    id: 'api_service',
    name: 'BrasilApiService.kt (Retrofit)',
    path: 'app/src/main/java/com/example/consultacnpj/data/network/BrasilApiService.kt',
    language: 'kotlin',
    description: 'Interface de endpoints HTTP do Retrofit 2 e Factory Singleton com OkHttpClient.',
    code: `package com.example.consultacnpj.data.network

import com.example.consultacnpj.data.model.CnpjResponse
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import java.util.concurrent.TimeUnit

interface BrasilApiService {

    @GET("api/cnpj/v1/{cnpj}")
    suspend fun consultarCnpj(
        @Path("cnpj") cnpj: String
    ): CnpjResponse

    companion object {
        private const val BASE_URL = "https://brasilapi.com.br/"

        fun create(): BrasilApiService {
            val loggingInterceptor = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val okHttpClient = OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .connectTimeout(15, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .build()

            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(BrasilApiService::class.java)
        }
    }
}
`
  },
  {
    id: 'viewmodel',
    name: 'CnpjViewModel.kt (StateFlow)',
    path: 'app/src/main/java/com/example/consultacnpj/ui/CnpjViewModel.kt',
    language: 'kotlin',
    description: 'ViewModel com coroutines, emissão de estados sealed CnpjUiState e sanitização de dígitos.',
    code: `package com.example.consultacnpj.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.consultacnpj.data.model.CnpjResponse
import com.example.consultacnpj.data.network.BrasilApiService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException

sealed interface CnpjUiState {
    object Idle : CnpjUiState
    object Loading : CnpjUiState
    data class Success(val empresa: CnpjResponse) : CnpjUiState
    data class Error(val mensagem: String) : CnpjUiState
}

class CnpjViewModel(
    private val apiService: BrasilApiService = BrasilApiService.create()
) : ViewModel() {

    private val _uiState = MutableStateFlow<CnpjUiState>(CnpjUiState.Idle)
    val uiState: StateFlow<CnpjUiState> = _uiState.asStateFlow()

    private val _cnpjInput = MutableStateFlow("")
    val cnpjInput: StateFlow<String> = _cnpjInput.asStateFlow()

    fun onCnpjChange(novoValor: String) {
        // Remove quaisquer caracteres que não sejam dígitos e restringe a 14 caracteres
        val apenasNumeros = novoValor.filter { it.isDigit() }.take(14)
        _cnpjInput.value = apenasNumeros
    }

    fun buscarCnpj() {
        val cnpjLimpo = _cnpjInput.value.filter { it.isDigit() }

        if (cnpjLimpo.length != 14) {
            _uiState.value = CnpjUiState.Error("O CNPJ deve conter exatamente 14 dígitos numéricos.")
            return
        }

        viewModelScope.launch {
            _uiState.value = CnpjUiState.Loading
            try {
                val resultado = apiService.consultarCnpj(cnpjLimpo)
                _uiState.value = CnpjUiState.Success(resultado)
            } catch (e: HttpException) {
                val erroMsg = when (e.code()) {
                    400 -> "CNPJ inválido de acordo com as regras de validação."
                    404 -> "CNPJ não encontrado na base de dados pública."
                    else -> "Erro na comunicação com a API (Código \${e.code()})."
                }
                _uiState.value = CnpjUiState.Error(erroMsg)
            } catch (e: IOException) {
                _uiState.value = CnpjUiState.Error("Falha de rede. Verifique sua conexão com a internet.")
            } catch (e: Exception) {
                _uiState.value = CnpjUiState.Error("Erro inesperado: \${e.localizedMessage ?: "Tente novamente."}")
            }
        }
    }

    fun limparBusca() {
        _cnpjInput.value = ""
        _uiState.value = CnpjUiState.Idle
    }
}
`
  }
];
